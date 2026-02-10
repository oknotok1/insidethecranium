/**
 * Contentful CMS Utilities
 */

import * as contentful from "contentful";

import type { FeaturedMusicFields, FeaturedSong } from "@/types/contentful";
import type { TracksResponse, TrackWithGenres } from "@/types/spotify";

import { logger } from "./logger";
import { extractSpotifyId, safeFetchSpotify } from "./spotify";

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

    // Fetch track details from Spotify API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const tracks = await safeFetchSpotify<TracksResponse>(
      `${baseUrl}/api/spotify/tracks?ids=${trackIds.join(",")}`,
      { next: { revalidate: false, tags: ["curated-tracks"] } },
      "Curated tracks",
    );

    if (tracks?.tracks) {
      logger.success(
        "Contentful",
        `Fetched ${tracks.tracks.length} curated tracks`,
      );
      return tracks.tracks;
    }

    return [];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Contentful", `Failed to fetch curated tracks: ${message}`);
    return [];
  }
};
