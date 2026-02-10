import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { addToHistory } from "../history/route";

import { auth } from "@/auth";
import { logger } from "@/utils/logger";

export async function POST(request: NextRequest) {
  try {
    // Check authentication via Google SSO session
    const session = await auth();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!session?.user?.email || session.user.email !== adminEmail) {
      logger.warn("Admin Cache", "❌ Unauthorized cache revalidation attempt");
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

      logger.log(
        "Admin Cache",
        `🔄 Purging all cache tags: ${tags.join(", ")}`,
      );

      tags.forEach((t) => revalidateTag(t, "max"));

      logger.success(
        "Admin Cache",
        `✓ Successfully purged ${tags.length} cache tags`,
      );

      const timestamp = new Date().toISOString();

      // Log to history
      addToHistory("all", "purge-all");

      return NextResponse.json({
        success: true,
        message: "Revalidated all cache tags",
        tags,
        timestamp,
      });
    }

    if (!tag) {
      return NextResponse.json(
        { error: "Tag or action required" },
        { status: 400 },
      );
    }

    // Revalidate specific tag
    logger.log("Admin Cache", `🔄 Revalidating cache tag: ${tag}`);

    revalidateTag(tag, "max");

    logger.success("Admin Cache", `✓ Successfully revalidated tag: ${tag}`);

    const timestamp = new Date().toISOString();

    // Log to history
    addToHistory(tag, "refresh");

    return NextResponse.json({
      success: true,
      message: `Revalidated cache tag: ${tag}`,
      tag,
      timestamp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to revalidate", details: error.message },
      { status: 500 },
    );
  }
}
