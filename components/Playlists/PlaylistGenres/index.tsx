"use client";

import { Music } from "lucide-react";

import { useState } from "react";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";

import type { GenreStat, Track } from "@/types/spotify";

const INITIAL_GENRES_SHOWN = 5;

// Helper to format song count text
const formatSongCount = (count: number): string =>
  `${count} song${count !== 1 ? "s" : ""}`;

// Helper to format genre stats text
const formatGenreStats = (count: number, percentage: number): string =>
  `${formatSongCount(count)} • ${percentage}%`;

// Helper to get album image URL
const getAlbumImageUrl = (track: Track): string | null => {
  const images = track.album.images;
  return images && images.length > 0 ? images[images.length - 1].url : null;
};

// Helper to format artists text
const formatArtists = (artists: Track["artists"]): string =>
  artists.map((a) => a.name).join(", ");

export default function PlaylistGenres({
  genreStats,
}: {
  genreStats: GenreStat[];
}) {
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
  const [showAllGenres, setShowAllGenres] = useState(false);

  const displayedGenres = showAllGenres
    ? genreStats
    : genreStats.slice(0, INITIAL_GENRES_SHOWN);

  const toggleGenre = (genre: string) => {
    setExpandedGenre(expandedGenre === genre ? null : genre);
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl text-gray-900 sm:text-2xl dark:text-white">
          Genres
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {displayedGenres.map((genreData) => (
            <GenreItem
              key={genreData.genre}
              genreData={genreData}
              isExpanded={expandedGenre === genreData.genre}
              onToggle={() => toggleGenre(genreData.genre)}
            />
          ))}
        </div>
        {genreStats.length > INITIAL_GENRES_SHOWN && (
          <button
            className="mt-3 rounded-lg bg-gray-200 px-3 py-2 text-xs text-gray-900 transition-colors hover:bg-gray-300 sm:mt-4 sm:px-4 sm:text-sm dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            onClick={() => setShowAllGenres(!showAllGenres)}
          >
            {showAllGenres ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </section>
  );
}

// Genre item component with expand/collapse
const GenreItem = ({
  genreData,
  isExpanded,
  onToggle,
}: {
  genreData: GenreStat;
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <div>
    <button
      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-all sm:px-4 sm:py-3 sm:text-base ${
        isExpanded
          ? "text-white"
          : "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
      }`}
      style={isExpanded ? { backgroundColor: "#3d38f5" } : undefined}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{genreData.genre}</span>
        <span
          className={`text-xs sm:text-sm ${isExpanded ? "text-white/90" : ""}`}
        >
          {formatGenreStats(genreData.count, genreData.percentage)}
        </span>
      </div>
    </button>

    {isExpanded && <TracksGrid tracks={genreData.tracks} />}
  </div>
);

// Tracks grid component
const TracksGrid = ({ tracks }: { tracks: Track[] }) => (
  <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/10 dark:bg-black/20">
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3 xl:grid-cols-4">
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  </div>
);

// Track card component
const TrackCard = ({ track }: { track: Track }) => {
  const imageUrl = getAlbumImageUrl(track);

  return (
    <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200 sm:space-x-3 sm:p-3 dark:bg-white/5 dark:hover:bg-white/10">
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-200 sm:h-12 sm:w-12 dark:bg-white/5">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={track.album.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 truncate text-xs text-gray-900 sm:text-sm dark:text-white">
          {track.name}
        </div>
        <div className="truncate text-xs text-gray-600 dark:text-gray-400">
          {formatArtists(track.artists)}
        </div>
      </div>
    </div>
  );
};
