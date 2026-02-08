import { NextRequest, NextResponse } from "next/server";
import { getSpotifyAccessToken, SPOTIFY_API } from "@/utils/spotify";
import { logger } from "@/utils/logger";

// Cache playlists indefinitely (24 hours for rebuild)
export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "50"); // Fetch all by default

  const user_id = "21h6osgmy2twlu7ichm7ygfhq";

  logger.log(
    "Playlists API",
    `Fetching playlists - offset: ${offset}, limit: ${limit}`,
  );

  try {
    const accessToken = await getSpotifyAccessToken();

    // Get playlists with pagination using native fetch
    const response = await fetch(
      `${SPOTIFY_API.BASE_URL}/users/${user_id}/playlists?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 86400, // Cache for 24 hours
          tags: ["playlists", `user-playlists:${user_id}`],
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const playlists = await response.json();

    logger.success(
      "Playlists API",
      `Fetched ${playlists.items?.length} playlists`,
    );

    // Decode HTML entities and strip HTML tags
    const decodeHtmlEntities = (text: string): string => {
      return text
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'")
        .replace(/<[^>]*>/g, ""); // Strip HTML tags
    };

    // Process playlists - decode HTML only, NO genre fetching
    const processedPlaylists = playlists.items.map((playlist: any) => ({
      ...playlist,
      description: playlist.description
        ? decodeHtmlEntities(playlist.description)
        : playlist.description,
    }));

    return NextResponse.json({
      items: processedPlaylists,
      total: playlists.total,
      offset: playlists.offset,
      limit: playlists.limit,
      next: playlists.next,
    });
  } catch (error: any) {
    logger.error(
      "Playlists API",
      `Error: ${error.response?.status || ""} ${error.message}`,
    );

    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 },
    );
  }
}
