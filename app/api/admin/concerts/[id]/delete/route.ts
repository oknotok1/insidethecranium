import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteConcert } from "@/utils/contentful-management";

/**
 * DELETE /api/admin/concerts/[id]/delete
 * Delete a concert entry
 */
export async function DELETE(
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

    await deleteConcert(id);

    return NextResponse.json({
      success: true,
      message: "Concert deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    
    const isTokenExpired = error.message === "TOKEN_EXPIRED";
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete concert",
        tokenExpired: isTokenExpired,
      },
      { status: isTokenExpired ? 401 : 500 },
    );
  }
}
