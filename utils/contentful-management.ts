/**
 * Contentful Management API Utilities
 * For creating, updating, and deleting content
 */

import { createClient } from "contentful-management";
import { logger } from "./logger";
import { isTokenExpiredError } from "./contentful-management-errors";

// Get management client
const getManagementClient = () => {
  const accessToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;

  if (!accessToken || !spaceId) {
    throw new Error(
      "CONTENTFUL_MANAGEMENT_TOKEN and CONTENTFUL_SPACE_ID must be set",
    );
  }

  return createClient({
    accessToken,
  });
};

/**
 * Upload asset (image or video) to Contentful
 */
export const uploadAsset = async (
  file: File,
  title: string,
  description?: string,
) => {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();

    // Create upload - Contentful expects the raw ArrayBuffer
    const upload = await environment.createUpload({
      file: arrayBuffer,
    });

    // Create asset
    const asset = await environment.createAsset({
      fields: {
        title: {
          "en-GB": title,
        },
        description: {
          "en-GB": description || "",
        },
        file: {
          "en-GB": {
            contentType: file.type,
            fileName: file.name,
            uploadFrom: {
              sys: {
                type: "Link",
                linkType: "Upload",
                id: upload.sys.id,
              },
            },
          },
        },
      },
    });

    // Process and publish
    const processedAsset = await asset.processForAllLocales();
    const publishedAsset = await processedAsset.publish();

    logger.success(
      "Contentful Management",
      `Uploaded and published asset: ${title}`,
    );

    return {
      id: publishedAsset.sys.id,
      url: publishedAsset.fields.file["en-GB"].url,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Contentful Management", `Failed to upload asset: ${message}`);
    
    if (isTokenExpiredError(error)) {
      throw new Error("TOKEN_EXPIRED");
    }
    
    throw error;
  }
};

/**
 * Create a new concert entry
 */
export const createConcert = async (data: {
  title: string;
  subtitle?: string;
  slug: string;
  artistBand: string;
  venueName: string;
  venueLocation?: string;
  eventDate: string;
  genres?: string[];
  reflection?: string;
  organizer?: string;
  organizerUrl?: string;
  status?: "confirmed" | "on-fence" | "went";
  price?: string;
  coverImageId?: string;
  galleryImageIds?: string[];
  videoIds?: string[];
  ticketLink?: string;
  venueLink?: string;
  setlistFmLink?: string;
  shouldPublish?: boolean;
}) => {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    const entry = await environment.createEntry("concert", {
      fields: {
        title: { "en-GB": data.title },
        subtitle: data.subtitle ? { "en-GB": data.subtitle } : undefined,
        slug: { "en-GB": data.slug },
        artistBand: { "en-GB": data.artistBand },
        venueName: { "en-GB": data.venueName },
        vanueLocation: data.venueLocation
          ? { "en-GB": data.venueLocation }
          : undefined,
        eventDate: { "en-GB": data.eventDate },
        genres: data.genres ? { "en-GB": data.genres } : undefined,
        reflection: data.reflection
          ? { "en-GB": data.reflection }
          : undefined,
        organizer: data.organizer ? { "en-GB": data.organizer } : undefined,
        organizerUrl: data.organizerUrl ? { "en-GB": data.organizerUrl } : undefined,
        status: data.status ? { "en-GB": data.status } : undefined,
        price: data.price ? { "en-GB": data.price } : undefined,
        coverImage: data.coverImageId
          ? {
              "en-GB": {
                sys: {
                  type: "Link",
                  linkType: "Asset",
                  id: data.coverImageId,
                },
              },
            }
          : undefined,
        galleryImages: data.galleryImageIds
          ? {
              "en-GB": data.galleryImageIds.map((id) => ({
                sys: {
                  type: "Link",
                  linkType: "Asset",
                  id,
                },
              })),
            }
          : undefined,
        videos: data.videoIds
          ? {
              "en-GB": data.videoIds.map((id) => ({
                sys: {
                  type: "Link",
                  linkType: "Asset",
                  id,
                },
              })),
            }
          : undefined,
        ticketLink: data.ticketLink ? { "en-GB": data.ticketLink } : undefined,
        venueLink: data.venueLink ? { "en-GB": data.venueLink } : undefined,
        setlistFmLink: data.setlistFmLink
          ? { "en-GB": data.setlistFmLink }
          : undefined,
      },
    });

    // Publish if requested
    if (data.shouldPublish) {
      await entry.publish();
      logger.success(
        "Contentful Management",
        `Created and published concert: ${data.title}`,
      );
    } else {
      logger.success(
        "Contentful Management",
        `Created concert draft: ${data.title}`,
      );
    }

    return {
      id: entry.sys.id,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      "Contentful Management",
      `Failed to create concert: ${message}`,
    );
    
    if (isTokenExpiredError(error)) {
      throw new Error("TOKEN_EXPIRED");
    }
    
    throw error;
  }
};

/**
 * Update an existing concert entry
 */
export const updateConcert = async (
  entryId: string,
  data: Partial<{
    title: string;
    subtitle: string;
    artistBand: string;
    venueName: string;
    venueLocation: string;
    eventDate: string;
    genres: string[];
    reflection: string;
    organizer: string;
    organizerUrl: string;
    status: "confirmed" | "on-fence" | "went";
    price: string;
    ticketLink: string;
    venueLink: string;
    setlistFmLink: string;
  }>,
) => {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    const entry = await environment.getEntry(entryId);

    // Update only provided fields
    // Map our clean names to Contentful's field names
    const fieldMapping: Record<string, string> = {
      venueLocation: "vanueLocation", // Contentful has typo
      setlistFmLink: "setlistFmLink", // Contentful uses camelCase
    };

    // URL fields that should be deleted if empty (Contentful validates URL format)
    const urlFields = ["ticketLink", "venueLink", "setlistFmLink", "organizerUrl"];

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof typeof data];
      const contentfulFieldName = fieldMapping[key] || key;

      if (value !== undefined) {
        // For URL fields, delete the field if empty string (Contentful validates URL format)
        if (urlFields.includes(key) && value === "") {
          delete entry.fields[contentfulFieldName];
        } else if (value !== "") {
          // Only set non-empty values
          entry.fields[contentfulFieldName] = { "en-GB": value };
        } else {
          // For non-URL fields, delete if empty
          delete entry.fields[contentfulFieldName];
        }
      }
    });

    const updatedEntry = await entry.update();

    // Re-publish if it was already published
    if (entry.sys.publishedVersion) {
      await updatedEntry.publish();
      logger.success(
        "Contentful Management",
        `Updated and re-published concert: ${entryId}`,
      );
    } else {
      logger.success(
        "Contentful Management",
        `Updated concert draft: ${entryId}`,
      );
    }

    return {
      id: updatedEntry.sys.id,
      success: true,
    };
  } catch (error: any) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      "Contentful Management",
      `Failed to update concert: ${message}`,
    );
    
    if (isTokenExpiredError(error)) {
      throw new Error("TOKEN_EXPIRED");
    }
    
    // Preserve Contentful validation error details
    if (error.details || error.message) {
      const enrichedError = new Error(message);
      (enrichedError as any).details = error.details || null;
      throw enrichedError;
    }
    
    throw error;
  }
};

/**
 * Toggle published status using Contentful's native publish/unpublish system
 */
export const togglePublishStatus = async (entryId: string) => {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    const entry = await environment.getEntry(entryId);
    const isCurrentlyPublished = Boolean(entry.sys.publishedVersion);

    if (isCurrentlyPublished) {
      // Unpublish the entry
      await entry.unpublish();
      logger.success(
        "Contentful Management",
        `Unpublished concert: ${entryId}`,
      );
      return {
        id: entry.sys.id,
        published: false,
        success: true,
      };
    } else {
      // Publish the entry
      await entry.publish();
      logger.success(
        "Contentful Management",
        `Published concert: ${entryId}`,
      );
      return {
        id: entry.sys.id,
        published: true,
        success: true,
      };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      "Contentful Management",
      `Failed to toggle publish status: ${message}`,
    );
    
    if (isTokenExpiredError(error)) {
      throw new Error("TOKEN_EXPIRED");
    }
    
    throw error;
  }
};

/**
 * Delete a concert entry
 */
export const deleteConcert = async (entryId: string) => {
  try {
    const client = getManagementClient();
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!);
    const environment = await space.getEnvironment("master");

    const entry = await environment.getEntry(entryId);

    // Unpublish if published
    if (entry.sys.publishedVersion) {
      await entry.unpublish();
    }

    // Delete
    await entry.delete();

    logger.success("Contentful Management", `Deleted concert: ${entryId}`);

    return {
      id: entryId,
      success: true,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      "Contentful Management",
      `Failed to delete concert: ${message}`,
    );
    
    if (isTokenExpiredError(error)) {
      throw new Error("TOKEN_EXPIRED");
    }
    
    throw error;
  }
};
