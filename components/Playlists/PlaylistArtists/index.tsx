"use client";

import { useState } from "react";
import Image from "next/image";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl text-gray-900 sm:text-2xl dark:text-white">
          Artists
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {displayedArtists.map((artist) => (
            <a
              key={artist.id}
              href={`https://open.spotify.com/artist/${artist.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-2 rounded-lg p-3 text-center transition-colors hover:bg-gray-100 sm:p-4 dark:hover:bg-white/5"
            >
              <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#3d38f5]/20 to-[#8b87ff]/10 sm:h-24 sm:w-24">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(artist.name)}&backgroundColor=3d38f5`}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
              <div className="w-full truncate px-1 text-xs font-medium text-gray-900 sm:px-2 sm:text-sm dark:text-white">
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
            className="mt-4 rounded-lg bg-gray-200 px-4 py-2 text-xs text-gray-900 transition-colors hover:bg-gray-300 sm:mt-6 sm:px-6 sm:text-sm dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
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
