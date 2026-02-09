import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 86400; // Cache for 24 hours

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    // First, get the screenshot URL from Microlink API
    const microlinkApiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&viewport.width=1200&viewport.height=675&meta=false&embed=screenshot.url`;
    
    const metaResponse = await fetch(microlinkApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InsideTheCranium/1.0)',
      },
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    });
    
    if (!metaResponse.ok) {
      console.error(`[Screenshot API] Microlink API returned ${metaResponse.status} for ${url}`);
      return NextResponse.json(
        { error: `Screenshot service returned ${metaResponse.status}` },
        { status: metaResponse.status }
      );
    }

    // Check if response is JSON or image
    const metaContentType = metaResponse.headers.get('content-type') || '';
    
    // If it's already an image, return it directly
    if (metaContentType.includes('image/')) {
      const imageBuffer = await metaResponse.arrayBuffer();
      
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          "Content-Type": metaContentType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        },
      });
    }

    // Otherwise parse JSON to get screenshot URL
    const metaData = await metaResponse.json();
    const screenshotUrl = metaData?.data?.screenshot?.url;
    
    if (!screenshotUrl) {
      console.error(`[Screenshot API] No screenshot URL in response for ${url}`);
      return NextResponse.json(
        { error: "No screenshot available" },
        { status: 404 }
      );
    }
    
    // Now fetch the actual screenshot image
    const response = await fetch(screenshotUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InsideTheCranium/1.0)',
      },
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    });
    
    if (!response.ok) {
      console.error(`[Screenshot API] Microlink returned ${response.status} for ${url}`);
      return NextResponse.json(
        { error: `Screenshot service returned ${response.status}` },
        { status: response.status }
      );
    }

    const imageContentType = response.headers.get('content-type') || '';
    const imageBuffer = await response.arrayBuffer();
    
    // If it's JSON (error response), log it
    if (imageContentType.includes('application/json') && imageBuffer.byteLength < 10000) {
      const text = new TextDecoder().decode(imageBuffer);
      console.error(`[Screenshot API] Microlink returned JSON error: ${text}`);
      return NextResponse.json(
        { error: "Screenshot service error", details: text },
        { status: 500 }
      );
    }
    
    // If response is too small, it's probably an error
    if (imageBuffer.byteLength < 1000) {
      console.error(`[Screenshot API] Response too small (${imageBuffer.byteLength} bytes), likely an error`);
      return NextResponse.json(
        { error: "Screenshot too small, likely failed" },
        { status: 500 }
      );
    }
    
    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": imageContentType || "image/png",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error(`[Screenshot API] Error for ${url}:`, error);
    return NextResponse.json(
      { error: "Failed to capture screenshot" },
      { status: 500 }
    );
  }
}
