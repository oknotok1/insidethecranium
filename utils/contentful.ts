/**
 * Contentful CMS Utilities
 */

import * as contentful from "contentful";

import type { FeaturedMusicFields, FeaturedSong } from "@/types/contentful";
import type { TracksResponse, TrackWithGenres } from "@/types/spotify";

import { logger } from "./logger";
import { extractSpotifyId } from "./spotify";

// Constants
const DEFAULT_ENTRY_ID = "6CiY2zbMl3CvJpY0FD2Wu1";

// Helper functions
const getContentfulClient = () => {
  return contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID || "",
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
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
