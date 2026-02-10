import { NextRequest, NextResponse } from "next/server";

import { logger } from "@/utils/logger";
import {
  getFreshSpotifyAccessToken,
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
    // Fetch with cache tag for on-demand invalidation
    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: false, // Cache forever
        tags: ["recently-played"], // Tag for invalidation
      },
    });

    // If 401 and we used a server token, retry with fresh token
    if (response.status === 401 && isServerToken) {
      logger.warn(
        "Recently Played API",
        "Token expired, fetching fresh token and retrying",
      );
      try {
        accessToken = await getFreshSpotifyAccessToken();
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          next: {
            revalidate: false,
            tags: ["recently-played"],
          },
        });
      } catch (retryErr: any) {
        logger.error(
          "Recently Played API",
          `Retry failed: ${retryErr.message}`,
        );
        return NextResponse.json(
          { error: "Failed to refresh token" },
          { status: 500 },
        );
      }
    }

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
