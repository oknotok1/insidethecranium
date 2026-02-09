"use client";

import { useState } from "react";

interface ArtistData {
  id: string;
  name: string;
  songCount: number;
  image?: string;
}

interface PlaylistArtistsProps {
  artists: ArtistData[];
}

export default function PlaylistArtists({ artists }: PlaylistArtistsProps) {
  const [showAllArtists, setShowAllArtists] = useState(false);

  // Show 2 rows initially (12 artists on XL screens: 6 cols x 2 rows)
  const initialArtistCount = 12;
  const displayedArtists = showAllArtists
    ? artists
    : artists.slice(0, initialArtistCount);

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl sm:text-2xl text-gray-900 dark:text-white">
          Artists
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {displayedArtists.map((artist) => (
            <a
              key={artist.id}
              href={`https://open.spotify.com/artist/${artist.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center space-y-2 p-3 sm:p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex items-center justify-center bg-linear-to-br from-[#3d38f5]/20 to-[#8b87ff]/10">
                {artist.image ? (
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(artist.name)}&backgroundColor=3d38f5`}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-xs sm:text-sm font-medium truncate w-full px-1 sm:px-2 text-gray-900 dark:text-white">
                {artist.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {artist.songCount} song{artist.songCount !== 1 ? "s" : ""}
              </div>
            </a>
          ))}
        </div>
        {artists.length > initialArtistCount && (
          <button
            className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 rounded-lg bg-gray-200 dark:bg-white/5 text-xs sm:text-sm hover:bg-gray-300 dark:hover:bg-white/10 transition-colors text-gray-900 dark:text-white"
            onClick={() => setShowAllArtists(!showAllArtists)}
          >
            {showAllArtists
              ? "Show Less"
              : `Show All ${artists.length} Artists`}
          </button>
        )}
      </div>
    </section>
  );
}
