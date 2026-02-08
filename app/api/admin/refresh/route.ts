import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 },
      );
    }

    const providedPassword = authHeader?.replace("Bearer ", "");

    if (providedPassword !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tag, action } = body;

    if (action === "purge-all") {
      // Revalidate all major tags
      const tags = [
        "playlists",
        "tracks",
        "artist-genres",
        "curated-tracks",
        "recently-played",
        "spotify-token",
      ];

      tags.forEach((t) => revalidateTag(t, "max"));

      return NextResponse.json({
        success: true,
        message: "Revalidated all cache tags",
        tags,
      });
    }

    if (!tag) {
      return NextResponse.json(
        { error: "Tag or action required" },
        { status: 400 },
      );
    }

    // Revalidate specific tag
    revalidateTag(tag, "max");

    return NextResponse.json({
      success: true,
      message: `Revalidated cache tag: ${tag}`,
      tag,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to revalidate", details: error.message },
      { status: 500 },
    );
  }
}
