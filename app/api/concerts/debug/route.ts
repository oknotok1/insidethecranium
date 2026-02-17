import { NextResponse } from "next/server";
import * as contentful from "contentful";

/**
 * Debug endpoint to see raw Contentful data
 * Visit: http://localhost:3000/api/concerts/debug
 */
export async function GET() {
  try {
    const client = contentful.createClient({
      space: process.env.CONTENTFUL_SPACE_ID || "",
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
    });

    // Fetch all entries with content type "concert"
    const response = await client.getEntries({
      content_type: "concert",
      limit: 100,
    });

    // Format concerts for sidebar
    const concerts = response.items.map((item: any) => ({
      id: item.sys.id,
      slug: item.fields.slug,
      title: item.fields.title,
      published: Boolean(item.sys.publishedVersion),
    }));

    return NextResponse.json({
      success: true,
      totalEntries: response.items.length,
      concerts, // For sidebar
      entries: response.items.map((item) => ({
        id: item.sys.id,
        contentType: item.sys.contentType.sys.id,
        createdAt: item.sys.createdAt,
        updatedAt: item.sys.updatedAt,
        fields: item.fields,
        // Show which fields are present
        fieldsPresent: Object.keys(item.fields),
      })),
      raw: response.items, // Full raw data
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
        stack: error.stack,
      },
      { status: 500 },
    );
  }
}
