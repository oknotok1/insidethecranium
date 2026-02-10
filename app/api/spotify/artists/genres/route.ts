import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/utils/logger";
import { shouldRetryRateLimit, waitForRetry } from "@/utils/rateLimitHandler";
import { SPOTIFY_API } from "@/utils/spotify";

// Cache artist genres indefinitely (static data that rarely changes)
export const revalidate = false;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artistIds = searchParams.get("artistIds");
  const accessToken = request.headers.get("access_token");

  logger.log(
    "Artists API",
    `Fetching ${artistIds?.split(",").length || 0} artists`,
  );

  if (!artistIds) {
    return NextResponse.json(
      { error: "Artist IDs are required" },
      { status: 400 },
    );
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token required" },
      { status: 401 },
    );
  }

  try {
    const idsArray = artistIds.split(",");

    const batches: string[][] = [];

    for (
      let i = 0;
      i < idsArray.length;
      i += SPOTIFY_API.MAX_ARTISTS_PER_REQUEST
    ) {
      batches.push(idsArray.slice(i, i + SPOTIFY_API.MAX_ARTISTS_PER_REQUEST));
    }

    logger.log("Artists API", `Processing ${batches.length} batches`);

    // Fetch batches sequentially with delay to avoid rate limits
    const responses = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount <= maxRetries) {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/artists?ids=${batch.join(",")}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              next: {
                revalidate: false, // Cache forever
                tags: ["artist-genres", ...batch.map((id) => `artist:${id}`)], // Tag each artist
              },
            },
          );

          // Handle rate limiting with retry
          if (response.status === 429) {
            const retryAfterHeader = response.headers.get("retry-after");
            const retryAfterSeconds = parseInt(retryAfterHeader || "5");

            const result = shouldRetryRateLimit(
              retryAfterSeconds,
              retryCount,
              maxRetries,
            );

            if (!result.shouldRetry) {
              logger.error(
                "Artists API",
                `${result.message} [batch ${i + 1}/${batches.length}]`,
              );
              responses.push({ artists: [] });
              break;
            }

            logger.warn(
              "Artists API",
              `${result.message} [batch ${i + 1}/${batches.length}]`,
            );
            await waitForRetry(result.retryAfter);
            retryCount++;
            continue;
          }

          if (!response.ok) {
            let errorText;
            try {
              const errorJson = await response.json();
              errorText = errorJson.error?.message || JSON.stringify(errorJson);
            } catch {
              errorText = await response.text();
            }
            logger.error(
              "Artists API",
              `Spotify API error: ${response.status} - ${errorText}`,
            );
            responses.push({ artists: [] });
            break;
          }

          const data = await response.json();
          responses.push(data);
          break; // Success, exit retry loop
        } catch (error: any) {
          logger.error(
            "Artists API",
            `Fetch error (attempt ${retryCount + 1}): ${error.message}`,
          );

          if (retryCount < maxRetries) {
            await new Promise((resolve) =>
              setTimeout(resolve, 2000 * (retryCount + 1)),
            ); // Exponential backoff
            retryCount++;
          } else {
            responses.push({ artists: [] });
            break;
          }
        }
      }

      // Add delay between batches to avoid rate limiting
      if (i < batches.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    const allArtists = responses.flatMap((response) => response.artists || []);

    // Map artists with their genres
    const artistsWithGenres = allArtists.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres || [],
      popularity: artist.popularity,
      images: artist.images,
    }));

    logger.success(
      "Artists API",
      `Returning ${artistsWithGenres.length} artists with genres`,
    );

    return NextResponse.json({
      artists: artistsWithGenres,
    });
  } catch (err: any) {
    logger.error("Artists API", `Fatal error: ${err.message}`);

    // Return a more helpful error message
    return NextResponse.json(
      {
        error: "Failed to fetch artist genres",
        details: err.message,
        artists: [], // Return empty array so client can handle gracefully
      },
      { status: 500 },
    );
  }
}
