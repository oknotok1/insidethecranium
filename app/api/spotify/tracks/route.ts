import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Cache for 5 minutes
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackIds = searchParams.get("ids");

  if (!trackIds) {
    return NextResponse.json(
      { error: "Track IDs are required" },
      { status: 400 }
    );
  }

  try {
    // Get access token
    const tokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify/token`,
      {
        method: "POST",
        next: { revalidate: 3000 } // Token cache
      }
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to get access token");
    }

    const { access_token } = await tokenResponse.json();

    // Fetch tracks from Spotify
    const tracksResponse = await axios.get(
      `https://api.spotify.com/v1/tracks?ids=${trackIds}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const validTracks = tracksResponse.data.tracks.filter((track: any) => track !== null);

    // Fetch genres for all artists
    const allArtistIds = validTracks.flatMap((track: any) =>
      track.artists.map((a: any) => a.id)
    );
    const uniqueArtistIds = [...new Set(allArtistIds)];

    let tracksWithGenres = validTracks;

    if (uniqueArtistIds.length > 0) {
      try {
        const genresResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify/artists/genres?artistIds=${uniqueArtistIds.join(",")}`,
          {
            headers: {
              access_token: access_token,
            },
            next: { revalidate: 300 }
          }
        );

        if (genresResponse.ok) {
          const genresData = await genresResponse.json();

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
              genres.slice(0, 2).forEach((genre: string) => trackGenres.add(genre));
            });

            return {
              ...track,
              genres: Array.from(trackGenres).slice(0, 3),
            };
          });
        }
      } catch (genreError) {
        console.error("Failed to fetch genres:", genreError);
        // Return tracks without genres
        tracksWithGenres = validTracks.map((track: any) => ({
          ...track,
          genres: [],
        }));
      }
    }

    return NextResponse.json({
      tracks: tracksWithGenres,
    });
  } catch (err: any) {
    console.error("Error fetching tracks:", err.response?.data || err);
    return NextResponse.json(
      { error: err.response?.data?.error?.message || "Internal Server Error" },
      { status: err.response?.status || 500 }
    );
  }
}
