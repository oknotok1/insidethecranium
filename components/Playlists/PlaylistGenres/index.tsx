"use client";

import { useState } from "react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Music } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl sm:text-2xl text-gray-900 dark:text-white">
          Genres
        </h2>
        <div className="space-y-2 sm:space-y-3">
          {displayedGenres.map((genreData) => {
            const isExpanded = expandedGenre === genreData.genre;

            return (
              <div key={genreData.genre}>
                <button
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-all text-sm sm:text-base ${
                    isExpanded
                      ? "text-white"
                      : "bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 text-gray-900 dark:text-white"
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
                  <div className="mt-2 p-3 sm:p-4 rounded-lg bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-2">
                      {genreData.tracks.map((track) => (
                        <div
                          key={track.id}
                          className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                          <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden bg-gray-200 dark:bg-white/5">
                            {track.album.images &&
                            track.album.images.length > 0 ? (
                              <ImageWithFallback
                                src={
                                  track.album.images[
                                    track.album.images.length - 1
                                  ].url
                                }
                                alt={track.album.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Music className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs sm:text-sm mb-1 truncate text-gray-900 dark:text-white">
                              {track.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
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
            className="mt-3 sm:mt-4 px-3 sm:px-4 py-2 rounded-lg bg-gray-200 dark:bg-white/5 text-xs sm:text-sm hover:bg-gray-300 dark:hover:bg-white/10 transition-colors text-gray-900 dark:text-white"
            onClick={() => setShowAllGenres(!showAllGenres)}
          >
            {showAllGenres ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </section>
  );
}
