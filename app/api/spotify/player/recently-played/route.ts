import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/utils/logger";
import {
  fetchSpotifyWithRetry,
  getSpotifyAccessToken,
  SPOTIFY_API,
} from "@/utils/spotify";

// Cache indefinitely - invalidated on-demand when track changes
export const revalidate = false;

export async function GET(request: NextRequest) {
  const url = `${SPOTIFY_API.BASE_URL}/me/player/recently-played?limit=1`;

  // Try to get token from headers first (for backward compatibility),
  // otherwise fetch server-side
  let accessToken = request.headers.get("access_token");
  let isServerToken = false;

  logger.log("Recently Played API", "Fetching recently played track");

  if (!accessToken) {
    try {
      accessToken = await getSpotifyAccessToken();
      isServerToken = true;
      logger.log("Recently Played API", "Using server-side access token");
    } catch (err: any) {
      logger.error(
        "Recently Played API",
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
    // For client tokens, let the client handle auth refresh
    if (isServerToken) {
      const { data, error, status } = await fetchSpotifyWithRetry(
        url,
        {
          accessToken,
          next: {
            revalidate: false,
            tags: ["recently-played"],
          },
        },
        "Recently Played API",
      );

      if (error) {
        return NextResponse.json(
          {
            error: "Failed to fetch recently played tracks",
            details: error,
          },
          { status: status || 500 },
        );
      }

      logger.success("Recently Played API", "✓ ✓ Cached recently played track");
      return NextResponse.json(data);
    } else {
      // Client token - single fetch without retry
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: false,
          tags: ["recently-played"],
        },
      });

      if (!response.ok) {
        const error = await response.json();
        logger.error(
          "Recently Played API",
          `Error: ${response.status} - ${error.error?.message || "Unknown"}`,
        );
        return NextResponse.json(
          {
            error: "Failed to fetch recently played tracks",
            details: error.error?.message || "Unknown error",
          },
          { status: response.status },
        );
      }

      const data = await response.json();
      logger.success("Recently Played API", "✓ Cached recently played track");
      return NextResponse.json(data);
    }
  } catch (err: any) {
    logger.error("Recently Played API", `Fatal error: ${err.message}`);
    return NextResponse.json(
      {
        error: "Failed to fetch recently played tracks",
        details: err.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
