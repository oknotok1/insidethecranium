import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import * as contentful from "contentful-management";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const entryId = formData.get("entryId") as string;
    const fieldName = formData.get("fieldName") as string; // "coverImage", "galleryImages", or "videos"

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Initialize Contentful Management API
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN || "",
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || "");
    const environment = await space.getEnvironment("master");

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Create asset in Contentful
    const asset = await environment.createAssetFromFiles({
      fields: {
        title: {
          "en-GB": file.name,
        },
        description: {
          "en-GB": `Uploaded for concert ${entryId}`,
        },
        file: {
          "en-GB": {
            contentType: file.type,
            fileName: file.name,
            file: uint8Array as any, // Contentful types are not perfectly aligned
          },
        },
      },
    });

    // Process the asset
    await asset.processForAllLocales();

    // Wait for processing (poll until ready)
    // Use longer timeout for videos (60 attempts = ~2 minutes) vs images (30 attempts = ~1 minute)
    const isVideo = file.type.startsWith("video/");
    const maxAttempts = isVideo ? 60 : 30;
    const pollInterval = 2000; // 2 seconds between checks
    
    let processedAsset = await environment.getAsset(asset.sys.id);
    let attempts = 0;
    
    while (!processedAsset.fields.file?.["en-GB"]?.url && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      processedAsset = await environment.getAsset(asset.sys.id);
      attempts++;
    }

    if (!processedAsset.fields.file?.["en-GB"]?.url) {
      const timeoutDuration = (maxAttempts * pollInterval) / 1000;
      throw new Error(
        `Asset processing timed out after ${timeoutDuration} seconds. Large ${isVideo ? "video" : "image"} files may require manual processing in Contentful.`
      );
    }

    // Publish the asset
    await processedAsset.publish();

    // If entryId and fieldName provided, link the asset to the entry
    if (entryId && fieldName) {
      const entry = await environment.getEntry(entryId);
      
      if (fieldName === "coverImage") {
        // Single asset - replace
        entry.fields[fieldName] = {
          "en-GB": {
            sys: {
              type: "Link",
              linkType: "Asset",
              id: asset.sys.id,
            },
          },
        };
      } else if (fieldName === "galleryImages" || fieldName === "videos") {
        // Array of assets - append
        const currentAssets = entry.fields[fieldName]?.["en-GB"] || [];
        entry.fields[fieldName] = {
          "en-GB": [
            ...currentAssets,
            {
              sys: {
                type: "Link",
                linkType: "Asset",
                id: asset.sys.id,
              },
            },
          ],
        };
      }

      await entry.update();
    }

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.sys.id,
        url: `https:${processedAsset.fields.file["en-GB"].url}`,
        fileName: file.name,
        contentType: file.type,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    
    // Handle Contentful API errors with detailed structure
    if (error.response) {
      const contentfulError = error.response.data || error.response;
      return NextResponse.json(
        {
          status: contentfulError.status || error.response.status || 500,
          statusText: contentfulError.statusText || error.response.statusText || "",
          message: contentfulError.message || error.message || "Upload failed",
          details: contentfulError.details,
          request: contentfulError.request,
          requestId: contentfulError.requestId || error.response.headers?.["x-contentful-request-id"],
        },
        { status: contentfulError.status || error.response.status || 500 }
      );
    }
    
    // Handle generic errors
    return NextResponse.json(
      { 
        status: 500,
        statusText: "Internal Server Error",
        message: error.message || "Upload failed",
        details: error.details,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove assets
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { assetId, entryId, fieldName, index } = await request.json();

    if (!assetId || !entryId || !fieldName) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN || "",
    });

    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID || "");
    const environment = await space.getEnvironment("master");

    // Remove asset reference from entry
    const entry = await environment.getEntry(entryId);
    
    if (fieldName === "coverImage") {
      // Remove cover image
      delete entry.fields[fieldName];
    } else if (fieldName === "galleryImages" || fieldName === "videos") {
      // Remove from array
      const currentAssets = entry.fields[fieldName]?.["en-GB"] || [];
      currentAssets.splice(index, 1);
      entry.fields[fieldName] = {
        "en-GB": currentAssets,
      };
    }

    await entry.update();

    // Optionally unpublish and delete the asset itself
    // (You might want to keep assets for history)
    try {
      const asset = await environment.getAsset(assetId);
      if (asset.isPublished()) {
        await asset.unpublish();
      }
      await asset.delete();
    } catch (error) {
      console.warn("Could not delete asset:", error);
      // Continue even if asset deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { 
        error: "Delete failed", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}
