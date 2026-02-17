import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Webhook secret for verification
const WEBHOOK_SECRET = process.env.CONTENTFUL_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const secret = request.headers.get("x-contentful-webhook-secret");
    
    if (!WEBHOOK_SECRET) {
      console.error("[Contentful Webhook] CONTENTFUL_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    if (secret !== WEBHOOK_SECRET) {
      console.error("[Contentful Webhook] Invalid webhook secret");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = await request.json();
    const contentType = payload?.sys?.contentType?.sys?.id;
    const entryId = payload?.sys?.id;
    const topic = request.headers.get("x-contentful-topic");

    console.log("[Contentful Webhook] Received:", {
      topic,
      contentType,
      entryId,
    });

    // Only process concert-related webhooks
    if (contentType !== "concert") {
      console.log("[Contentful Webhook] Ignoring non-concert content type:", contentType);
      return NextResponse.json({ 
        message: "Ignored: Not a concert content type",
        contentType 
      });
    }

    // Revalidate concert pages based on the action
    const revalidated: string[] = [];

    // Revalidate the homepage (shows concerts preview)
    revalidatePath("/");
    revalidated.push("/");

    // Always revalidate the main concerts list page
    revalidatePath("/concerts");
    revalidated.push("/concerts");

    // Revalidate the specific concert detail page if we have the slug
    if (payload?.fields?.slug) {
      const slug = typeof payload.fields.slug === "string" 
        ? payload.fields.slug 
        : payload.fields.slug["en-US"] || payload.fields.slug["en-GB"];
      
      if (slug) {
        revalidatePath(`/concerts/${slug}`);
        revalidated.push(`/concerts/${slug}`);
      }
    }

    console.log("[Contentful Webhook] ✓ Revalidated:", revalidated);

    return NextResponse.json({
      success: true,
      revalidated,
      contentType,
      entryId,
      topic,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Contentful Webhook] Error:", error);
    return NextResponse.json(
      { 
        error: "Webhook processing failed",
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Contentful webhook endpoint is active",
    timestamp: new Date().toISOString(),
  });
}
