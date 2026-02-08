import { NextRequest, NextResponse } from "next/server";
import { createClient } from "contentful";
import { logger } from "@/utils/logger";

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  throw new Error("Contentful space ID and access token must be defined");
}

const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get("entryId");

  if (entryId) {
    try {
      const response = await client.getEntry(entryId);

      if (!response) {
        return NextResponse.json(
          { error: "Entry not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(response.fields.featuredSongs);
    } catch (error: any) {
      logger.error('Contentful API', `Error fetching entry: ${error.message}`);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  } else {
    try {
      const response = await client.getEntries();

      if (response.items.length === 0) {
        return NextResponse.json(
          { error: "No entries found" },
          { status: 404 }
        );
      }

      return NextResponse.json(response.items);
    } catch (error: any) {
      logger.error('Contentful API', `Error fetching entries: ${error.message}`);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
