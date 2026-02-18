import { NextRequest, NextResponse } from "next/server";

import { isAllowedSpotifyImageUrl } from "@/lib/spotify-image";

// Cache curated (static) Spotify artwork for 1 year
const CACHE_MAX_AGE = 31536000; // 1 year

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url query parameter" },
      { status: 400 },
    );
  }

  const decoded = decodeURIComponent(url);
  if (!isAllowedSpotifyImageUrl(decoded)) {
    return NextResponse.json(
      { error: "Invalid or disallowed image URL" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(decoded, {
      headers: { "User-Agent": "InsideTheCranium/1.0" },
      next: { revalidate: false }, // Rely on response Cache-Control
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status },
      );
    }

    const contentType =
      res.headers.get("content-type") || "image/jpeg";
    const body = await res.arrayBuffer();

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
      },
    });
  } catch (err) {
    console.error("[Spotify image proxy]", err);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 502 },
    );
  }
}
