"use client";

import { Loader2 } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import PlaylistCard from "@/components/Playlists/PlaylistCard";

import type { Playlist } from "@/types/spotify";

const BATCH_SIZE = 10;
const BATCH_DELAY_MS = 100;

interface PlaylistsGridProps {
  initialPlaylists: Playlist[];
  totalCount: number;
}

// Helper to build API URL for fetching playlists
const buildPlaylistsUrl = (offset: number): string =>
  `/api/spotify/playlists?limit=${BATCH_SIZE}&offset=${offset}&includeGenres=false`;

export default function PlaylistsGrid({
  initialPlaylists,
  totalCount,
}: PlaylistsGridProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
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
          const response = await fetch(buildPlaylistsUrl(currentOffset));

          if (!response.ok) {
            hasError = true;
            break;
          }

          const data = await response.json();
          if (!data.items || data.items.length === 0) break;

          allPlaylists = [...allPlaylists, ...data.items];
          currentOffset += data.items.length;
          setPlaylists(allPlaylists);

          if (currentOffset >= totalCount) {
            setIsDone(true);
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
        } catch (error) {
          console.error("Error loading playlists batch:", error);
          hasError = true;
          break;
        }
      }

      setIsLoading(false);
      if (currentOffset >= totalCount) {
        setIsDone(true);
      } else if (hasError) {
        setLoadError(true);
      }
      loadingRef.current = false;
    };

    loadAllBatches();
  }, [initialPlaylists, totalCount]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
        {playlists.map((playlist, index) => (
          <PlaylistCard key={`${playlist.id}-${index}`} playlist={playlist} />
        ))}
      </div>

      {isLoading && !isDone && <LoadingIndicator />}
      {!isLoading && !isDone && loadError && (
        <ErrorMessage loadedCount={playlists.length} totalCount={totalCount} />
      )}
    </>
  );
}

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
      Loading more playlists...
    </span>
  </div>
);

// Error message component
const ErrorMessage = ({
  loadedCount,
  totalCount,
}: {
  loadedCount: number;
  totalCount: number;
}) => (
  <div className="flex items-center justify-center py-8 text-sm text-gray-600 dark:text-gray-400">
    <span>
      Loaded {loadedCount} of {totalCount} playlists. Some failed to load.
    </span>
  </div>
);
