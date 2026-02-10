import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";

// Types for revalidation history
interface RevalidationEvent {
  id: string;
  tag: string;
  timestamp: string;
  action: "refresh" | "purge-all";
}

// In-memory storage (resets on server restart/redeploy, but accessible from any device)
// For production, you could replace this with Vercel KV, Redis, or a database
let revalidationHistory: RevalidationEvent[] = [];
const MAX_HISTORY_ITEMS = 100;

// Helper function to check authentication
async function isAuthenticated(): Promise<boolean> {
  // Check session (Google SSO only)
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;
  return session?.user?.email === adminEmail;
}

// Internal function to add to history (used by other API routes)
export function addToHistory(
  tag: string,
  action: "refresh" | "purge-all",
): void {
  const event: RevalidationEvent = {
    id: `${Date.now()}-${Math.random()}`,
    tag,
    timestamp: new Date().toISOString(),
    action,
  };

  revalidationHistory = [event, ...revalidationHistory].slice(
    0,
    MAX_HISTORY_ITEMS,
  );
}

export async function GET() {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      history: revalidationHistory,
      count: revalidationHistory.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch history", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tag, action } = body;

    if (!tag || !action) {
      return NextResponse.json(
        { error: "Tag and action required" },
        { status: 400 },
      );
    }

    // Add new event to history
    const event: RevalidationEvent = {
      id: `${Date.now()}-${Math.random()}`,
      tag,
      timestamp: new Date().toISOString(),
      action,
    };

    // Add to beginning and limit size
    revalidationHistory = [event, ...revalidationHistory].slice(
      0,
      MAX_HISTORY_ITEMS,
    );

    return NextResponse.json({
      success: true,
      event,
      totalEvents: revalidationHistory.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to add to history", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  try {
    // Check authentication
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Clear history
    revalidationHistory = [];

    return NextResponse.json({
      success: true,
      message: "History cleared",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to clear history", details: error.message },
      { status: 500 },
    );
  }
}
