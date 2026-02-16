import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { togglePublishStatus } from "@/utils/contentful-management";

/**
 * PATCH /api/admin/concerts/[id]/publish
 * Toggle published status of a concert
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const result = await togglePublishStatus(id);

    return NextResponse.json({
      success: true,
      published: result.published,
      message: result.published
        ? "Concert published successfully"
        : "Concert unpublished successfully",
    });
  } catch (error: any) {
    console.error("Publish toggle error:", error);
    
    const isTokenExpired = error.message === "TOKEN_EXPIRED";
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to toggle publish status",
        tokenExpired: isTokenExpired,
      },
      { status: isTokenExpired ? 401 : 500 },
    );
  }
}
