import { NextRequest, NextResponse } from "next/server";

import { fetchConcerts } from "@/utils/contentful";
import { logger } from "@/utils/logger";

// Enable caching for this API route - revalidate every 24 hours
export const revalidate = 86400;

/**
 * GET /api/concerts
 * Fetches all published concerts
 * Query params:
 *   - limit: number (default: 100)
 *   - order: string (default: '-fields.eventDate')
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100");
    const order = searchParams.get("order") || "-fields.eventDate";

    const concerts = await fetchConcerts(limit, order);

    return NextResponse.json(
      {
        concerts,
        count: concerts.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        },
      },
    );
  } catch (error: any) {
    logger.error("Concerts API", `Error fetching concerts: ${error.message}`);
    return NextResponse.json(
      { error: "Failed to fetch concerts" },
      { status: 500 },
    );
  }
}
