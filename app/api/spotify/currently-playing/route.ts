import { NextRequest, NextResponse } from "next/server";
import { SPOTIFY_API } from "@/utils/spotify";
import { logger } from "@/utils/logger";

// Don't cache currently playing (real-time data)
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const url = `${SPOTIFY_API.BASE_URL}/me/player/currently-playing`;
  const accessToken = request.headers.get("access_token");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token required" },
      { status: 401 },
    );
  }

  try {
    // Use native fetch for consistency
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store", // Don't cache real-time data
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: "Failed to fetch currently playing" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err: any) {
    logger.error("Currently Playing API", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
