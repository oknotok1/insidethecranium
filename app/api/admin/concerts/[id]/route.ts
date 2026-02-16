import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateConcert } from "@/utils/contentful-management";
import { isTokenExpiredError } from "@/utils/contentful-management-errors";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Update the concert
    const result = await updateConcert(id, body);

    return NextResponse.json({
      success: true,
      id: result.id,
    });
  } catch (error) {
    console.error("Error updating concert:", error);

    const message = error instanceof Error ? error.message : String(error);

    if (message === "TOKEN_EXPIRED" || isTokenExpiredError(error)) {
      return NextResponse.json(
        {
          success: false,
          error: "Contentful Management API token has expired",
          details: {
            message: "Please regenerate your Contentful Management API token",
            instructions: "Go to Contentful Settings > API keys > Content management tokens",
          },
          tokenExpired: true,
        },
        { status: 401 }
      );
    }

    // Parse Contentful validation errors
    let errorDetails = null;
    if (error && typeof error === "object" && "details" in error) {
      errorDetails = (error as any).details;
    } else if (error instanceof Error && error.message) {
      try {
        // Try to parse if message contains JSON
        const parsed = JSON.parse(error.message);
        if (parsed.details) {
          errorDetails = parsed.details;
        }
      } catch {
        // Not JSON, use as is
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: message || "Failed to update concert",
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
