/**
 * Contentful CMS Utilities
 */

import * as contentful from "contentful";
import type { Entry } from "contentful";

import { cache } from "react";

import type {
  Concert,
  ConcertDetail,
  ConcertListItem,
  ContentfulAsset,
  FeaturedMusicFields,
  FeaturedSong,
  GalleryImage,
  VideoItem,
} from "@/types/contentful";
import type { TracksResponse, TrackWithGenres } from "@/types/spotify";

import { logger } from "./logger";
import { extractSpotifyId } from "./spotify";

// Constants
const DEFAULT_ENTRY_ID = "6CiY2zbMl3CvJpY0FD2Wu1";
const CONCERT_CONTENT_TYPE = "concert";

// Helper functions
const getContentfulClient = () => {
  return contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID || "",
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
  });
};

// Preview API client for fetching unpublished content (admin use)
const getPreviewClient = () => {
  return contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID || "",
    accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || "",
    host: "preview.contentful.com",
  });
};

/**
 * Fetches curated tracks from Contentful and enriches them with Spotify data
 * @param entryId - The Contentful entry ID for the featured music collection
 * @returns Array of tracks with genre data
 */
export const fetchCuratedTracks = async (
  entryId: string = DEFAULT_ENTRY_ID,
): Promise<TrackWithGenres[]> => {
  try {
    const client = getContentfulClient();
    const entry = await client.getEntry(entryId);
    const fields = entry.fields as FeaturedMusicFields;
    const songs = fields.featuredSongs || [];

    // Extract Spotify track IDs from URLs
    const trackIds = songs
      .map((song: FeaturedSong) => extractSpotifyId(song.url))
      .filter((id: string | undefined): id is string => Boolean(id));

    if (trackIds.length === 0) {
      logger.warn("Contentful", "No valid track IDs found in featured songs");
      return [];
    }

    // Fetch track details from our API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(
      `${baseUrl}/api/spotify/tracks?ids=${trackIds.join(",")}`,
      { next: { revalidate: false, tags: ["curated-tracks"] } },
    );

    if (!response.ok) {
      logger.error("Contentful", `Failed to fetch tracks: ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data?.tracks) {
      logger.success(
        "Contentful",
        `Fetched ${data.tracks.length} curated tracks`,
      );
      return data.tracks;
    }

    return [];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Contentful", `Failed to fetch curated tracks: ${message}`);
    return [];
  }
};

/**
 * Transforms a Contentful concert entry to a list item
 */
const transformConcertToListItem = (
  entry: Entry<Concert, undefined, string>,
): ConcertListItem => {
  const { sys, fields } = entry;

  return {
    id: sys.id,
    title: fields.title,
    subtitle: fields.subtitle,
    slug: fields.slug,
    artistBand: fields.artistBand,
    genres: fields.genres,
    venueName: fields.venueName,
    venueLocation: fields.vanueLocation, // Note: Contentful has typo "vanueLocation"
    eventDate: fields.eventDate,
    organizer: fields.organizer,
    organizerUrl: fields.organizerUrl,
    status: fields.status,
    price: fields.price,
    coverImageUrl: (() => {
      const asset = fields.coverImage as
        | ContentfulAsset
        | { sys: { id: string } }
        | undefined;
      if (asset && "fields" in asset && asset.fields?.file?.url) {
        return `https:${asset.fields.file.url}`;
      }
      return undefined;
    })(),
    coverImageAlt: (() => {
      const asset = fields.coverImage as
        | ContentfulAsset
        | { sys: { id: string } }
        | undefined;
      return asset && "fields" in asset ? asset.fields?.title : undefined;
    })(),
    ticketLink: fields.ticketLink,
    venueLink: fields.venueLink,
    createdAt: sys.createdAt,
    updatedAt: sys.updatedAt,
  };
};

/**
 * Transforms a Contentful concert entry to a detailed view
 */
const transformConcertToDetail = (
  entry: Entry<Concert, undefined, string>,
): ConcertDetail => {
  const listItem = transformConcertToListItem(entry);
  const { fields } = entry;

  // Filter out assets that don't have fields populated (unpublished or unresolved)
  const galleryImages: GalleryImage[] = fields.galleryImages
    ? (fields.galleryImages as Array<ContentfulAsset | { sys: { id: string } }>)
        .filter(
          (asset): asset is ContentfulAsset =>
            "fields" in asset && !!asset.fields?.file?.url,
        )
        .map((asset) => ({
          url: `https:${asset.fields.file.url}`,
          alt: asset.fields.title || "",
          width: asset.fields.file.details.image?.width,
          height: asset.fields.file.details.image?.height,
        }))
    : [];

  const videos: VideoItem[] = fields.videos
    ? (fields.videos as Array<ContentfulAsset | { sys: { id: string } }>)
        .filter(
          (asset): asset is ContentfulAsset =>
            "fields" in asset && !!asset.fields?.file?.url,
        )
        .map((asset) => ({
          url: `https:${asset.fields.file.url}`,
          fileName: asset.fields.file.fileName,
          contentType: asset.fields.file.contentType,
        }))
    : [];

  return {
    ...listItem,
    reflection: fields.reflection,
    organizer: fields.organizer,
    ticketLink: fields.ticketLink,
    venueLink: fields.venueLink,
    setlistFmLink: fields.setlistFmLink, // Note: Contentful uses camelCase "setlistFmLink"
    galleryImages,
    videos,
  };
};

/**
 * Fetches all published concerts from Contentful (list items only)
 * @param limit - Maximum number of concerts to fetch (default: 100)
 * @param order - Order of results (default: '-fields.eventDate' for newest first)
 * @returns Array of concert list items
 */
export const fetchConcerts = cache(
  async (
    limit: number = 100,
    order: string = "-fields.eventDate",
  ): Promise<ConcertListItem[]> => {
    try {
      const client = getContentfulClient();

      // First, try fetching ALL concerts without published filter to debug
      const allResponse = await client.getEntries({
        content_type: CONCERT_CONTENT_TYPE,
        limit,
        order: [order as "-fields.eventDate"],
      });

      logger.success(
        "Contentful",
        `Found ${allResponse.items.length} total concerts (including unpublished)`,
      );

      // Filter for published concerts using sys.publishedVersion
      const publishedConcerts = allResponse.items.filter((item) =>
        Boolean(item.sys.publishedVersion),
      );

      logger.success(
        "Contentful",
        `Found ${publishedConcerts.length} published concerts`,
      );

      const concerts = publishedConcerts.map((entry) =>
        transformConcertToListItem(
          entry as unknown as Entry<Concert, undefined, string>,
        ),
      );

      return concerts;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error("Contentful", `Failed to fetch concerts: ${message}`);
      console.error("Contentful Error Details:", error);
      return [];
    }
  },
);

/**
 * Fetches all published concerts with full details including media
 * @param limit - Maximum number of concerts to fetch (default: 100)
 * @param order - Order of results (default: '-fields.eventDate' for newest first)
 * @returns Array of detailed concerts with gallery and video data
 */
export const fetchConcertsDetailed = cache(
  async (
    limit: number = 100,
    order: string = "-fields.eventDate",
  ): Promise<ConcertDetail[]> => {
    try {
      const client = getContentfulClient();

      const response = await client.getEntries({
        content_type: CONCERT_CONTENT_TYPE,
        limit,
        order: [order as "-fields.eventDate"],
      });

      // Filter for published concerts
      const publishedConcerts = response.items.filter((item) =>
        Boolean(item.sys.publishedVersion),
      );

      logger.success(
        "Contentful",
        `Fetched ${publishedConcerts.length} detailed concerts with media`,
      );

      const concerts = publishedConcerts.map((entry) =>
        transformConcertToDetail(
          entry as unknown as Entry<Concert, undefined, string>,
        ),
      );

      return concerts;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(
        "Contentful",
        `Failed to fetch detailed concerts: ${message}`,
      );
      console.error("Contentful Error Details:", error);
      return [];
    }
  },
);

/**
 * Fetches a single concert by slug
 * Uses CDA to fetch only published entries for public display
 * @param slug - The concert slug
 * @returns Concert detail or null if not found
 */
export const fetchConcertBySlug = cache(
  async (slug: string): Promise<ConcertDetail | null> => {
    try {
      const client = getContentfulClient();

      const response = await client.getEntries({
        content_type: CONCERT_CONTENT_TYPE,
        "fields.slug": slug,
        limit: 1,
      });

      if (response.items.length === 0) {
        logger.warn("Contentful", `Concert not found with slug: ${slug}`);
        return null;
      }

      const entry = response.items[0];

      // Only return if published
      if (!Boolean(entry.sys.publishedVersion)) {
        logger.warn(
          "Contentful",
          `Concert exists but is not published: ${slug}`,
        );
        return null;
      }

      const concert = transformConcertToDetail(
        entry as unknown as Entry<Concert, undefined, string>,
      );

      logger.success("Contentful", `Fetched concert: ${concert.title}`);
      return concert;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error("Contentful", `Failed to fetch concert by slug: ${message}`);
      return null;
    }
  },
);

/**
 * Fetches all concerts (including unpublished) for admin use
 * Uses Preview API to access both published and unpublished entries
 * @param limit - Maximum number of concerts to fetch (default: 100)
 * @returns Array of all concert list items with published status
 */
export const fetchAllConcerts = async (
  limit: number = 100,
): Promise<(ConcertListItem & { published: boolean })[]> => {
  try {
    const client = getPreviewClient();

    const response = await client.getEntries({
      content_type: CONCERT_CONTENT_TYPE,
      limit,
      order: ["-sys.updatedAt"] as const,
    });

    const concerts = response.items.map((entry) => ({
      ...transformConcertToListItem(
        entry as unknown as Entry<Concert, undefined, string>,
      ),
      // Check if entry is published in Contentful (has publishedVersion)
      published: Boolean(entry.sys.publishedVersion),
    }));

    logger.success(
      "Contentful",
      `Fetched ${concerts.length} concerts (${concerts.filter((c) => c.published).length} published, ${concerts.filter((c) => !c.published).length} unpublished)`,
    );
    return concerts;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Contentful", `Failed to fetch all concerts: ${message}`);
    return [];
  }
};

/**
 * Fetches a single concert by ID for admin editing
 * Uses Preview API to access both published and unpublished entries
 * @param id - The Contentful entry ID
 * @returns Concert detail with published status or null if not found
 */
export const fetchConcertById = async (
  id: string,
): Promise<(ConcertDetail & { id: string; published: boolean }) | null> => {
  try {
    const client = getPreviewClient();

    const entry = await client.getEntry(id);

    if (!entry || entry.sys.contentType?.sys.id !== CONCERT_CONTENT_TYPE) {
      logger.warn("Contentful", `Concert not found with ID: ${id}`);
      return null;
    }

    const concert = {
      ...transformConcertToDetail(
        entry as unknown as Entry<Concert, undefined, string>,
      ),
      id: entry.sys.id,
      published: Boolean(entry.sys.publishedVersion),
    };

    logger.success(
      "Contentful",
      `Fetched concert for editing: ${concert.title}`,
    );
    return concert;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Contentful", `Failed to fetch concert by ID: ${message}`);
    return null;
  }
};
