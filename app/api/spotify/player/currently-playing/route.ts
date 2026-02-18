import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/utils/logger";
import {
  fetchSpotifyWithRetry,
  getSpotifyAccessToken,
  SPOTIFY_API,
} from "@/utils/spotify";

// Don't cache currently playing (real-time data)
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const url = `${SPOTIFY_API.BASE_URL}/me/player/currently-playing`;

  // Try to get token from headers first (for backward compatibility),
  // otherwise fetch server-side
  let accessToken = request.headers.get("access_token");
  let isServerToken = false;

  if (!accessToken) {
    try {
      accessToken = await getSpotifyAccessToken();
      isServerToken = true;
      logger.log("Currently Playing API", "Using server-side access token");
    } catch (err: any) {
      logger.error(
        "Currently Playing API",
        `Failed to get token: ${err.message}`,
      );
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 500 },
      );
    }
  }

  try {
    // Use centralized fetch with automatic retry (only for server tokens)
    if (isServerToken) {
      const { data, error, status } = await fetchSpotifyWithRetry(
        url,
        {
          accessToken,
          next: { revalidate: 0 }, // Don't cache real-time data
        },
        "Currently Playing API",
      );

      if (error) {
        return NextResponse.json(
          { error: "Failed to fetch currently playing" },
          { status: status || 500 },
        );
      }

      return NextResponse.json(data);
    } else {
      // Client token - single fetch without retry
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to fetch currently playing" },
          { status: response.status },
        );
      }

      if (response.status === 204) return NextResponse.json(null);

      const data = await response.json();

      return NextResponse.json(data);
    }
  } catch (err: any) {
    logger.error("Currently Playing API", err.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
