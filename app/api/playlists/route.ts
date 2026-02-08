import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Cache for 5 minutes
export const revalidate = 300;

async function getSpotifyAccessToken() {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;

  const token = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  if (SPOTIFY_REFRESH_TOKEN) {
    params.append("refresh_token", SPOTIFY_REFRESH_TOKEN);
  }

  try {
    const { data } = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          Authorization: `Basic ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    return data.access_token;
  } catch (error) {
    console.error("Error getting Spotify access token:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "12");

  const user_id = "21h6osgmy2twlu7ichm7ygfhq";

  try {
    const accessToken = await getSpotifyAccessToken();

    // Get playlists with pagination
    const { data: playlists } = await axios.get(
      `https://api.spotify.com/v1/users/${user_id}/playlists?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    // Decode HTML entities and strip HTML tags
    const decodeHtmlEntities = (text: string): string => {
      return text
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'")
        .replace(/<[^>]*>/g, ""); // Strip HTML tags
    };

    // Process playlists and fetch genres
    const playlistsWithGenres = [];

    for (const playlist of playlists.items) {
      const decodedPlaylist = {
        ...playlist,
        description: playlist.description
          ? decodeHtmlEntities(playlist.description)
          : playlist.description,
        topGenres: [] as string[],
      };

      try {
        // Get a sample of tracks from the playlist (first 10 for speed)
        const { data: tracksData } = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=10&fields=items(track(artists(id)))`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        // Collect unique artist IDs
        const artistIds = new Set<string>();
        tracksData.items?.forEach((item: any) => {
          if (item.track?.artists) {
            item.track.artists.forEach((artist: any) => {
              if (artist.id) artistIds.add(artist.id);
            });
          }
        });

        // Fetch artist details for genres (batch request)
        if (artistIds.size > 0) {
          const artistIdsArray = Array.from(artistIds).slice(0, 20);

          const { data: artistsData } = await axios.get(
            `https://api.spotify.com/v1/artists?ids=${artistIdsArray.join(",")}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          // Count genre occurrences
          const genreCount: { [genre: string]: number } = {};
          artistsData.artists?.forEach((artist: any) => {
            if (artist?.genres) {
              artist.genres.forEach((genre: string) => {
                genreCount[genre] = (genreCount[genre] || 0) + 1;
              });
            }
          });

          // Get top 3 genres
          const sortedGenres = Object.entries(genreCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([genre]) => genre);

          decodedPlaylist.topGenres = sortedGenres;
        }
      } catch (error) {
        console.error(
          `Error fetching genres for playlist ${playlist.id}:`,
          error,
        );
      }

      playlistsWithGenres.push(decodedPlaylist);
    }

    return NextResponse.json({
      items: playlistsWithGenres,
      total: playlists.total,
      offset: playlists.offset,
      limit: playlists.limit,
      next: playlists.next,
    });
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 },
    );
  }
}
