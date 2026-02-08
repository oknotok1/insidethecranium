import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Short cache to prevent API hammering (30 seconds)
export const revalidate = 30;

export async function GET(request: NextRequest) {
  const url = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
  const accessToken = request.headers.get("access_token");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token required" },
      { status: 401 },
    );
  }

  try {
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Recently played error:", err.response?.data || err.message);
    return NextResponse.json(
      {
        error: "Failed to fetch recently played tracks",
        details: err.response?.data?.error?.message || "Unknown error",
      },
      { status: err.response?.status || 500 },
    );
  }
}
