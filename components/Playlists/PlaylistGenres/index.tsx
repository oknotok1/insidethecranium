"use client";

import { ChevronRight, Music, Pause, Play } from "lucide-react";

import { useState } from "react";

import { usePreviewPlayer } from "@/contexts/PreviewPlayerContext";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";

import { useYouTubeSearch } from "@/hooks/useYouTubeSearch";

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
            className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-900 transition-colors hover:bg-gray-200 sm:mt-4 sm:px-4 sm:text-sm dark:bg-white/6 dark:text-white dark:hover:bg-white/11"
            onClick={() => setShowAllGenres(!showAllGenres)}
          >
            {showAllGenres ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </section>
  );
}

// Genre item component with expand/collapse - Progress bar style
const GenreItem = ({
  genreData,
  isExpanded,
  onToggle,
}: {
  genreData: GenreStat;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const percentage = genreData.percentage;

  // Calculate color intensity based on percentage for filled portion
  const lightFillOpacity = 0.15 + (percentage / 100) * 0.25; // 15% to 40%
  const darkFillOpacity = 0.08 + (percentage / 100) * 0.14; // 8% to 22%

  return (
    <div>
      <button
        className={`group relative w-full cursor-pointer overflow-hidden rounded-lg px-3 py-2.5 text-left text-sm transition-colors sm:px-4 sm:py-3 sm:text-base ${
          isExpanded
            ? "bg-[#3d38f5] text-white"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-white/6 dark:text-white dark:hover:bg-white/11"
        }`}
        onClick={onToggle}
      >
        {/* Light mode filled portion - purple overlay */}
        {!isExpanded && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 transition-colors dark:opacity-0"
            style={{
              width: `${percentage}%`,
              backgroundColor: `rgba(61, 56, 245, ${lightFillOpacity})`,
            }}
          />
        )}

        {/* Dark mode filled portion - white overlay */}
        {!isExpanded && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 opacity-0 transition-colors dark:opacity-100"
            style={{
              width: `${percentage}%`,
              backgroundColor: `rgba(255, 255, 255, ${darkFillOpacity})`,
            }}
          />
        )}

        <div className="relative z-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ChevronRight
              className={`h-4 w-4 shrink-0 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
            <span className="font-medium">{genreData.genre}</span>
          </div>
          <span
            className={`shrink-0 text-xs sm:text-sm ${isExpanded ? "text-white/90" : "text-gray-600 dark:text-gray-400"}`}
          >
            {formatGenreStats(genreData.count, genreData.percentage)}
          </span>
        </div>
      </button>

      {isExpanded && <TracksGrid tracks={genreData.tracks} />}
    </div>
  );
};

// Tracks grid component
const TracksGrid = ({ tracks }: { tracks: Track[] }) => (
  <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/8 dark:bg-black/20">
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
  const spotifyUrl =
    track.external_urls?.spotify ||
    `https://open.spotify.com/track/${track.id}`;
  const {
    togglePlayPause,
    currentTrack,
    isPlaying: globalIsPlaying,
  } = usePreviewPlayer();
  const { searchVideo } = useYouTubeSearch();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && globalIsPlaying;

  const handleCardClick = async () => {
    const artistName = track.artists[0]?.name || "";
    const youtubeVideoId = await searchVideo(track.name, artistName);

    togglePlayPause({
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      spotifyUrl: spotifyUrl,
      youtubeVideoId: youtubeVideoId || undefined,
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex cursor-pointer items-center space-x-2 rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200 sm:space-x-3 sm:p-3 dark:bg-white/6 dark:hover:bg-white/11"
    >
      {/* Album Art with Play Button */}
      <div className="group/artwork relative h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-200 sm:h-12 sm:w-12 dark:bg-white/8">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={track.album.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-4 w-4 text-gray-400" />
          </div>
        )}

        {/* Play Button Overlay */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              handleCardClick();
            }
          }}
          role="button"
          tabIndex={0}
          className={`absolute inset-0 flex cursor-pointer items-center justify-center transition-all duration-200 hover:bg-black/40 ${
            isCurrentTrack
              ? "bg-black/40 opacity-100"
              : "bg-black/20 opacity-0 group-hover:bg-black/40 group-hover:opacity-100 group-[.hovering-title]:opacity-0"
          }`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <div className="rounded-full bg-white/90 p-1 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 dark:bg-black/90">
            {isPlaying ? (
              <Pause className="h-3 w-3 fill-current text-gray-900 dark:text-white" />
            ) : (
              <Play className="h-3 w-3 fill-current text-gray-900 dark:text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Track Info */}
      <div className="min-w-0 flex-1">
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => {
            const card = e.currentTarget.closest(".group");
            card?.classList.add("hovering-title");
          }}
          onMouseLeave={(e) => {
            const card = e.currentTarget.closest(".group");
            card?.classList.remove("hovering-title");
          }}
          className="mb-1 inline text-xs font-medium text-gray-900 transition-colors hover:text-[#3d38f5] hover:underline sm:text-sm dark:text-white dark:hover:text-[#8b87ff]"
        >
          {track.name}
        </a>
        <div className="truncate text-xs text-gray-600 dark:text-gray-400">
          {track.artists.map((artist, idx) => {
            // Artists from PlaylistTrack have external_urls at runtime
            const artistWithUrls = artist as typeof artist & {
              external_urls?: { spotify: string };
            };
            return (
              <span key={artist.id || idx}>
                {artistWithUrls.external_urls?.spotify ? (
                  <a
                    href={artistWithUrls.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => {
                      const card = e.currentTarget.closest(".group");
                      card?.classList.add("hovering-title");
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget.closest(".group");
                      card?.classList.remove("hovering-title");
                    }}
                    className="inline transition-colors hover:text-[#3d38f5] hover:underline dark:hover:text-[#8b87ff]"
                  >
                    {artist.name}
                  </a>
                ) : (
                  artist.name
                )}
                {idx < track.artists.length - 1 && ", "}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
