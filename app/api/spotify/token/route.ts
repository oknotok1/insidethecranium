import { NextResponse } from "next/server";
import { getSpotifyAccessToken } from "@/utils/spotify";
import { logger } from "@/utils/logger";

// Cache tokens for 50 minutes (tokens last 1 hour)
export const revalidate = 3000;

async function refreshAccessToken() {
  logger.log("Token API", "Refreshing access token");

  try {
    const accessToken = await getSpotifyAccessToken();
    logger.success("Token API", "Token refreshed successfully");
    return NextResponse.json({ access_token: accessToken });
  } catch (err: any) {
    logger.error("Token API", `Fatal error: ${err.message}`);
    return NextResponse.json(
      { error: "Failed to refresh access token" },
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
