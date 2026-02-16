import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/utils/logger";
import { fetchSpotifyWithRetry } from "@/utils/spotify";

// Cache tracks indefinitely (static content)
export const revalidate = false;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackIds = searchParams.get("ids");

  logger.log(
    "Tracks API",
    `Fetching ${trackIds?.split(",").length || 0} tracks`,
  );

  if (!trackIds) {
    return NextResponse.json(
      { error: "Track IDs are required" },
      { status: 400 },
    );
  }

  try {
    // Get access token
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/auth/token`,
      {
        method: "GET",
        next: { revalidate: 3000 }, // Token cache
      },
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to get access token");
    }

    const { access_token } = await tokenResponse.json();
    logger.success("Tracks API", "Got access token");

    // Fetch tracks from Spotify with automatic 401 retry
    const {
      data: tracksData,
      error,
      status,
    } = await fetchSpotifyWithRetry<{ tracks: any[] }>(
      `https://api.spotify.com/v1/tracks?ids=${trackIds}`,
      {
        accessToken: access_token,
        next: {
          revalidate: false, // Cache forever
          tags: ["tracks", ...trackIds.split(",").map((id) => `track:${id}`)],
        },
      },
      "Tracks API",
    );

    if (!tracksData || error) {
      return NextResponse.json(
        { error: error || "Failed to fetch tracks", tracks: [] },
        { status: status || 500 },
      );
    }

    const validTracks = tracksData.tracks.filter(
      (track: any) => track !== null,
    );
    logger.success("Tracks API", `Got ${validTracks.length} valid tracks`);

    // Fetch genres for all artists
    const allArtistIds = validTracks.flatMap((track: any) =>
      track.artists.map((a: any) => a.id),
    );
    const uniqueArtistIds = [...new Set(allArtistIds)];

    let tracksWithGenres = validTracks;

    if (uniqueArtistIds.length > 0) {
      try {
        logger.log(
          "Tracks API",
          `Fetching genres for ${uniqueArtistIds.length} artists`,
        );
        const genresResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/artists/genres?artistIds=${uniqueArtistIds.join(",")}`,
          {
            headers: {
              access_token: access_token,
            },
            next: {
              revalidate: false, // Cache forever
              tags: ["artist-genres"],
            },
          },
        );

        if (genresResponse.ok) {
          const genresData = await genresResponse.json();
          logger.success(
            "Tracks API",
            `Got genres for ${genresData.artists?.length || 0} artists`,
          );

          // Create a map of artist ID to genres
          const artistGenresMap = new Map();
          genresData.artists.forEach((artist: any) => {
            artistGenresMap.set(artist.id, artist.genres || []);
          });

          // Add genres to each track
          tracksWithGenres = validTracks.map((track: any) => {
            const trackGenres = new Set<string>();
            track.artists.forEach((artist: any) => {
              const genres = artistGenresMap.get(artist.id) || [];
              genres
                .slice(0, 2)
                .forEach((genre: string) => trackGenres.add(genre));
            });

            return {
              ...track,
              genres: Array.from(trackGenres).slice(0, 3),
            };
          });
          logger.success("Tracks API", "Added genres to tracks");
        } else {
          logger.error(
            "Tracks API",
            `Failed to fetch genres: ${genresResponse.status}`,
          );
        }
      } catch (genreError: any) {
        logger.error("Tracks API", `Genre fetch error: ${genreError.message}`);
        // Return tracks without genres
        tracksWithGenres = validTracks.map((track: any) => ({
          ...track,
          genres: [],
        }));
      }
    }

    logger.log(
      "Tracks API",
      `Returning ${tracksWithGenres.length} tracks with genres`,
    );
    return NextResponse.json({
      tracks: tracksWithGenres,
    });
  } catch (err: any) {
    logger.error("Tracks API", `Fatal error: ${err.message}`);
    return NextResponse.json(
      { error: err.error?.message || "Internal Server Error" },
      { status: err.status || 500 },
    );
  }
}
