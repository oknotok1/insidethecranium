import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken, SPOTIFY_API } from "@/utils/spotify";
import { logger } from "@/utils/logger";

// Cache playlists indefinitely (24 hours for rebuild)
export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "50"); // Fetch all by default
  const includeGenres = searchParams.get("includeGenres") !== "false"; // Include genres by default

  const user_id = "21h6osgmy2twlu7ichm7ygfhq";

  logger.log(
    "Playlists API",
    `Fetching playlists - offset: ${offset}, limit: ${limit}, genres: ${includeGenres}`,
  );

  try {
    const accessToken = await getSpotifyAccessToken();

    // Get playlists with pagination using native fetch
    const fetchStart = Date.now();
    const response = await fetch(
      `${SPOTIFY_API.BASE_URL}/users/${user_id}/playlists?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 86400, // Cache for 24 hours
          tags: ["playlists", `user-playlists:${user_id}`],
        },
      },
    );
    const fetchTime = Date.now() - fetchStart;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const playlists = await response.json();

    // Indicate if cached (< 50ms likely from cache)
    const source = fetchTime < 50 ? "[CACHE]" : "[SPOTIFY API]";
    logger.success(
      "Playlists API",
      `✓ ${source} Fetched ${playlists.items?.length} playlists (${fetchTime}ms)`,
    );

    // Decode HTML entities and strip HTML tags
    const decodeHtmlEntities = (text: string): string => {
      return text
        .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16))) // Hex entities
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)) // Decimal entities
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'")
        .replace(/<[^>]*>/g, ""); // Strip HTML tags
    };

    // Get genres for playlists if requested
    let playlistGenres: Record<string, string[]> = {};
    
    if (includeGenres) {
      try {
        // Limit to first 30 playlists to avoid rate limiting
        const playlistsToProcess = playlists.items.slice(0, 30);
      
      for (let i = 0; i < playlistsToProcess.length; i++) {
        const playlist = playlistsToProcess[i];
        
        try {
          // Skip if playlist has no tracks
          if (!playlist.tracks?.total || playlist.tracks.total === 0) {
            continue;
          }

          // Add small delay between requests to avoid rate limiting
          if (i > 0 && i % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          // Fetch first 10 tracks
          const tracksResponse = await fetch(`${playlist.tracks.href}?limit=10`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            next: {
              revalidate: 86400,
              tags: [`playlist-tracks:${playlist.id}`],
            },
          });

          if (!tracksResponse.ok) {
            // Handle rate limiting
            if (tracksResponse.status === 429) {
              logger.warn("Playlists API", `Rate limited while fetching tracks, stopping genre fetch`);
              break; // Stop processing more playlists
            }
            logger.warn("Playlists API", `Failed to fetch tracks for ${playlist.name}: ${tracksResponse.status}`);
            continue;
          }

          const tracksData = await tracksResponse.json();
          const artistIds = new Set<string>();

          tracksData.items?.forEach((item: any) => {
            item.track?.artists?.forEach((artist: any) => {
              if (artist.id) artistIds.add(artist.id);
            });
          });

          if (artistIds.size === 0) {
            logger.warn("Playlists API", `No artists found for ${playlist.name}`);
            continue;
          }

          // Fetch artist genres
          const artistIdsArray = Array.from(artistIds);
          const artistsFetchStart = Date.now();
          const artistsResponse = await fetch(
            `${SPOTIFY_API.BASE_URL}/artists?ids=${artistIdsArray.slice(0, 50).join(",")}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              next: {
                revalidate: false,
                tags: artistIdsArray.map((id) => `artist:${id}`),
              },
            },
          );
          const artistsFetchTime = Date.now() - artistsFetchStart;

          // Handle rate limiting on artist fetch
          if (artistsResponse.status === 429) {
            logger.warn("Playlists API", `⚠ Rate limited while fetching artists, stopping genre fetch`);
            break; // Stop processing more playlists
          }

          if (artistsResponse.ok) {
            const artistsData = await artistsResponse.json();
            const genreCount: Record<string, number> = {};

            artistsData.artists?.forEach((artist: any) => {
              artist?.genres?.forEach((genre: string) => {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
              });
            });

            if (Object.keys(genreCount).length > 0) {
              const topGenres = Object.entries(genreCount)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 2)
                .map(([genre]) => genre);

              playlistGenres[playlist.id] = topGenres;
            }
          } else {
            logger.warn("Playlists API", `Failed to fetch artists for ${playlist.name}: ${artistsResponse.status}`);
          }
        } catch (error) {
          logger.warn("Playlists API", `Failed to fetch genres for ${playlist.id}`);
        }
      }

        
        logger.success("Playlists API", `✓ Fetched genres for ${Object.keys(playlistGenres).length}/${playlistsToProcess.length} playlists (mostly cached)`);
      } catch (error: any) {
        logger.error("Playlists API", `✗ Error fetching genres: ${error.message}`);
      }
    }

    // Process playlists - decode HTML and add genres
    const processedPlaylists = playlists.items.map((playlist: any) => ({
      ...playlist,
      description: playlist.description
        ? decodeHtmlEntities(playlist.description)
        : playlist.description,
      topGenres: playlistGenres[playlist.id] || [],
    }));

    return NextResponse.json({
      items: processedPlaylists,
      total: playlists.total,
      offset: playlists.offset,
      limit: playlists.limit,
      next: playlists.next,
    });
  } catch (error: any) {
    logger.error(
      "Playlists API",
      `Error: ${error.response?.status || ""} ${error.message}`,
    );

    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 },
    );
  }
}
