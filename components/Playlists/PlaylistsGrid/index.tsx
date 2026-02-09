"use client";

import { useState, useEffect, useRef } from "react";
import PlaylistCard from "@/components/Playlists/PlaylistCard";
import { Item as SpotifyPlaylist } from "@/types/spotify";
import { Loader2 } from "lucide-react";

interface PlaylistsGridProps {
  initialPlaylists: SpotifyPlaylist[];
  totalCount: number;
}

const BATCH_SIZE = 10;

export default function PlaylistsGrid({
  initialPlaylists,
  totalCount,
}: PlaylistsGridProps) {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>(
    initialPlaylists,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(initialPlaylists.length >= totalCount);
  const [loadError, setLoadError] = useState(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    const loadAllBatches = async () => {
      if (loadingRef.current || initialPlaylists.length >= totalCount) return;
      
      loadingRef.current = true;
      setIsLoading(true);

      let currentOffset = initialPlaylists.length;
      let allPlaylists = [...initialPlaylists];
      let hasError = false;

      while (currentOffset < totalCount) {
        try {
          // Skip genre fetching for client-side batches to avoid rate limiting
          const response = await fetch(
            `/api/spotify/playlists?limit=${BATCH_SIZE}&offset=${currentOffset}&includeGenres=false`,
          );

          if (!response.ok) {
            hasError = true;
            break;
          }

          const data = await response.json();
          if (!data.items || data.items.length === 0) break;

          allPlaylists = [...allPlaylists, ...data.items];
          currentOffset += data.items.length;
          setPlaylists(allPlaylists);

          // Check if we're done
          if (currentOffset >= totalCount) {
            setIsDone(true);
            break;
          }

          // Small delay between batches
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error) {
          console.error("Error loading playlists batch:", error);
          hasError = true;
          break;
        }
      }

      setIsLoading(false);
      // Only mark as done if we successfully loaded everything
      if (currentOffset >= totalCount) {
        setIsDone(true);
      } else if (hasError) {
        setLoadError(true);
      }
      loadingRef.current = false;
    };

    loadAllBatches();
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>

      {/* Loading indicator at bottom */}
      {isLoading && !isDone && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            Loading more playlists...
          </span>
        </div>
      )}

      {/* Error state - show if loading failed before completion */}
      {!isLoading && !isDone && loadError && (
        <div className="flex items-center justify-center py-8 text-sm text-gray-600 dark:text-gray-400">
          <span>
            Loaded {playlists.length} of {totalCount} playlists. Some failed to
            load.
          </span>
        </div>
      )}
    </>
  );
}
