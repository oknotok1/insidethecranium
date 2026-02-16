import { NextRequest, NextResponse } from "next/server";

import { fetchConcertBySlug } from "@/utils/contentful";
import { logger } from "@/utils/logger";

// Enable caching for this API route - revalidate every 24 hours
export const revalidate = 86400;

/**
 * GET /api/concerts/[slug]
 * Fetches a single concert by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const concert = await fetchConcertBySlug(slug);

    if (!concert) {
      return NextResponse.json({ error: "Concert not found" }, { status: 404 });
    }

    return NextResponse.json(concert, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (error: any) {
    logger.error(
      "Concerts API",
      `Error fetching concert by slug: ${error.message}`,
    );
    return NextResponse.json(
      { error: "Failed to fetch concert" },
      { status: 500 },
    );
  }
}
