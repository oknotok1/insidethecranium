"use client";

import { useCallback } from "react";

// In-memory cache for YouTube search results
const searchCache = new Map<string, string | null>();

export function useYouTubeSearch() {
  const searchVideo = useCallback(async (
    trackName: string,
    artistName: string
  ): Promise<string | null> => {
    const query = `${trackName} ${artistName}`;
    const cacheKey = query.toLowerCase();

    // Return cached result if available
    if (searchCache.has(cacheKey)) {
      return searchCache.get(cacheKey) || null;
    }

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      const videoId = data.videoId || null;

      // Cache the result
      searchCache.set(cacheKey, videoId);

      return videoId;
    } catch (error) {
      console.error("[YouTube Search] Error:", error);
      return null;
    }
  }, []);

  return { searchVideo };
}
