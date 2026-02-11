import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Search YouTube for a music video
 * GET /api/youtube/search?q=track+name+artist
 * Caches results for 24 hours
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter 'q' is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      );
    }

    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("q", query);
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("videoCategoryId", "10"); // Music category
    searchUrl.searchParams.set("maxResults", "1");
    searchUrl.searchParams.set("key", apiKey);

    const response = await fetch(searchUrl.toString(), {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const data = await response.json();
    const videoId = data.items?.[0]?.id?.videoId || null;

    return NextResponse.json({ videoId });
  } catch (error) {
    console.error("[YouTube API] Search error:", error);
    return NextResponse.json(
      { error: "Failed to search YouTube" },
      { status: 500 }
    );
  }
}
