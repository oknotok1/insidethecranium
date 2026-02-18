import { NextResponse } from "next/server";

import { logger } from "@/utils/logger";
import { getSpotifyAccessToken } from "@/utils/spotify";

// Cache tokens for 40 minutes (tokens last 1 hour, using safe margin)
export const revalidate = 2400;

// Simple in-memory rate limiter + last token (so rate-limited requests still get a valid token)
let lastTokenFetch = 0;
let lastAccessToken: string | null = null;
let consecutiveFailures = 0;
const MIN_FETCH_INTERVAL = 5000; // 5 seconds minimum between fetches
const MAX_FAILURES = 5; // Stop trying after 5 consecutive failures
const FAILURE_RESET_TIME = 300000; // Reset failure count after 5 minutes

async function refreshAccessToken() {
  const now = Date.now();

  // Check if we've had too many consecutive failures
  if (consecutiveFailures >= MAX_FAILURES) {
    if (now - lastTokenFetch < FAILURE_RESET_TIME) {
      logger.warn(
        "Token API",
        `Rate limited: ${consecutiveFailures} consecutive failures. Try again in ${Math.ceil((FAILURE_RESET_TIME - (now - lastTokenFetch)) / 1000)}s`,
      );
      if (lastAccessToken) {
        return NextResponse.json({ access_token: lastAccessToken });
      }
      return NextResponse.json(
        {
          error:
            "Token service temporarily unavailable. Please check your Spotify credentials.",
          retryAfter: Math.ceil(
            (FAILURE_RESET_TIME - (now - lastTokenFetch)) / 1000,
          ),
        },
        { status: 503 },
      );
    }
    consecutiveFailures = 0;
  }

  // Within rate limit window: return last token so hero doesn't stay on skeleton
  if (now - lastTokenFetch < MIN_FETCH_INTERVAL) {
    if (lastAccessToken) {
      logger.warn(
        "Token API",
        `Rate limited: returning cached token (last fetch ${now - lastTokenFetch}ms ago)`,
      );
      return NextResponse.json({ access_token: lastAccessToken });
    }
    logger.warn(
      "Token API",
      `Rate limited: Last fetch was ${now - lastTokenFetch}ms ago`,
    );
    return NextResponse.json(
      { error: "Rate limited. Try again in a few seconds." },
      { status: 429 },
    );
  }

  logger.log("Token API", "Refreshing access token");

  try {
    // Validate environment variables
    if (
      !process.env.SPOTIFY_CLIENT_ID ||
      !process.env.SPOTIFY_CLIENT_SECRET ||
      !process.env.SPOTIFY_REFRESH_TOKEN
    ) {
      throw new Error("Missing Spotify credentials in environment variables");
    }

    const accessToken = await getSpotifyAccessToken();

    lastTokenFetch = now;
    lastAccessToken = accessToken;
    consecutiveFailures = 0;
    logger.success("Token API", "Token refreshed successfully");
    return NextResponse.json({ access_token: accessToken });
  } catch (err: any) {
    consecutiveFailures++;
    logger.error(
      "Token API",
      `Failed to refresh token (${consecutiveFailures}/${MAX_FAILURES}): ${err.message}`,
    );

    // Check if it's a Spotify API error
    if (err.message?.includes("400") || err.message?.includes("401")) {
      logger.error(
        "Token API",
        "Invalid refresh token. Please regenerate your Spotify refresh token.",
      );
      return NextResponse.json(
        {
          error:
            "Invalid Spotify credentials. Please check your refresh token.",
          details: err.message,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to refresh access token",
        details: err.message,
      },
      { status: 500 },
    );
  }
}

// Support both GET and POST for better compatibility
export async function GET() {
  return refreshAccessToken();
}

export async function POST() {
  return refreshAccessToken();
}
