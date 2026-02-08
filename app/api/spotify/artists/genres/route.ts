import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Cache for 5 minutes
export const revalidate = 300;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const artistIds = searchParams.get("artistIds");
  const accessToken = request.headers.get("access_token");

  if (!artistIds) {
    return NextResponse.json(
      { error: "Artist IDs are required" },
      { status: 400 }
    );
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token required" },
      { status: 401 }
    );
  }

  try {
    const idsArray = artistIds.split(",");

    // Spotify allows max 50 artists per request
    const BATCH_SIZE = 50;
    const batches: string[][] = [];

    for (let i = 0; i < idsArray.length; i += BATCH_SIZE) {
      batches.push(idsArray.slice(i, i + BATCH_SIZE));
    }

    // Fetch all batches in parallel
    const batchPromises = batches.map((batch) =>
      axios.get(`https://api.spotify.com/v1/artists?ids=${batch.join(",")}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );

    const responses = await Promise.all(batchPromises);
    const allArtists = responses.flatMap((response) => response.data.artists);

    // Map artists with their genres
    const artistsWithGenres = allArtists.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres || [],
      popularity: artist.popularity,
      images: artist.images,
    }));

    return NextResponse.json({
      artists: artistsWithGenres,
    });
  } catch (err: any) {
    console.error("Error fetching artists:", err.response?.data || err);
    return NextResponse.json(
      { error: err.response?.data?.error?.message || "Internal Server Error" },
      { status: err.response?.status || 500 }
    );
  }
}
