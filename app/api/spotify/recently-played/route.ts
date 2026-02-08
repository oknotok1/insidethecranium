import { NextRequest, NextResponse } from "next/server";
import { SPOTIFY_API } from "@/utils/spotify";
import { logger } from "@/utils/logger";

// Cache indefinitely - invalidated on-demand when track changes
export const revalidate = false;

export async function GET(request: NextRequest) {
  const url = `${SPOTIFY_API.BASE_URL}/me/player/recently-played?limit=1`;
  const accessToken = request.headers.get("access_token");

  logger.log("Recently Played API", "Fetching recently played track");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token required" },
      { status: 401 },
    );
  }

  try {
    // Fetch with cache tag for on-demand invalidation
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: false, // Cache forever
        tags: ["recently-played"], // Tag for invalidation
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
    logger.success("Recently Played API", "Cached recently played track");
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
