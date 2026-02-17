import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paths } = await request.json();

    // Default paths to revalidate if none specified
    const pathsToRevalidate = paths || [
      "/",
      "/concerts",
      "/playlists",
    ];

    const revalidated: string[] = [];

    for (const path of pathsToRevalidate) {
      revalidatePath(path);
      revalidated.push(path);
    }

    console.log("[Manual Revalidate] ✓ Revalidated:", revalidated);

    return NextResponse.json({
      success: true,
      revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Manual Revalidate] Error:", error);
    return NextResponse.json(
      {
        error: "Revalidation failed",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
