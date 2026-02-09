import { NextRequest, NextResponse } from "next/server";
import { SPOTIFY_API, getSpotifyAccessToken, getFreshSpotifyAccessToken } from "@/utils/spotify";
import { logger } from "@/utils/logger";

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
      logger.error("Currently Playing API", `Failed to get token: ${err.message}`);
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 500 },
      );
    }
  }

  try {
    // Use native fetch for consistency
    let response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store", // Don't cache real-time data
    });

    // If 401 and we used a server token, retry with fresh token
    if (response.status === 401 && isServerToken) {
      logger.warn("Currently Playing API", "Token expired, fetching fresh token and retrying");
      try {
        accessToken = await getFreshSpotifyAccessToken();
        response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        });
      } catch (retryErr: any) {
        logger.error("Currently Playing API", `Retry failed: ${retryErr.message}`);
        return NextResponse.json(
          { error: "Failed to refresh token" },
          { status: 500 },
        );
      }
    }

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
