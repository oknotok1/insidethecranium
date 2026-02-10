"use client";

import { useState } from "react";

import { Music } from "lucide-react";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";

interface Track {
  id: string;
  name: string;
  duration_ms: number;
  album: {
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  artists: Array<{
    id: string;
    name: string;
  }>;
}

interface GenreStat {
  genre: string;
  count: number;
  percentage: number;
  tracks: Track[];
}

interface PlaylistGenresProps {
  genreStats: GenreStat[];
}

export default function PlaylistGenres({ genreStats }: PlaylistGenresProps) {
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);
  const [showAllGenres, setShowAllGenres] = useState(false);

  const displayedGenres = showAllGenres ? genreStats : genreStats.slice(0, 5);

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl text-gray-900 sm:text-2xl dark:text-white">
          Genres
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {displayedGenres.map((genreData) => {
            const isExpanded = expandedGenre === genreData.genre;

            return (
              <div key={genreData.genre}>
                <button
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-all sm:px-4 sm:py-3 sm:text-base ${
                    isExpanded
                      ? "text-white"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  }`}
                  style={
                    isExpanded ? { backgroundColor: "#3d38f5" } : undefined
                  }
                  onClick={() =>
                    setExpandedGenre(isExpanded ? null : genreData.genre)
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{genreData.genre}</span>
                    <span
                      className={`text-xs sm:text-sm ${
                        isExpanded ? "text-white/90" : ""
                      }`}
                    >
                      {genreData.count} song{genreData.count !== 1 ? "s" : ""} •{" "}
                      {genreData.percentage}%
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/10 dark:bg-black/20">
                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-2 sm:gap-2 lg:grid-cols-3 xl:grid-cols-4">
                      {genreData.tracks.map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center space-x-2 rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200 sm:space-x-3 sm:p-3 dark:bg-white/5 dark:hover:bg-white/10"
                        >
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-200 sm:h-12 sm:w-12 dark:bg-white/5">
                            {track.album.images &&
                            track.album.images.length > 0 ? (
                              <ImageWithFallback
                                src={
                                  track.album.images[
                                    track.album.images.length - 1
                                  ].url
                                }
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
                              {track.artists.map((a) => a.name).join(", ")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {genreStats.length > 5 && (
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
