"use client";

import { useState } from "react";

import Image from "next/image";

import type { PlaylistArtist } from "@/types/spotify";

const INITIAL_ARTISTS_SHOWN = 12;
const DICEBEAR_API_BASE = "https://api.dicebear.com/7.x/initials/svg";
const SPOTIFY_ARTIST_URL = "https://open.spotify.com/artist/";

interface PlaylistArtistsProps {
  artists: PlaylistArtist[];
}

// Helper to format song count text
const formatSongCount = (count: number): string =>
  `${count} song${count !== 1 ? "s" : ""}`;

// Helper to generate fallback avatar URL
const getFallbackAvatarUrl = (name: string): string =>
  `${DICEBEAR_API_BASE}?seed=${encodeURIComponent(name)}&backgroundColor=3d38f5`;

// Helper to build Spotify artist URL
const getSpotifyArtistUrl = (artistId: string): string =>
  `${SPOTIFY_ARTIST_URL}${artistId}`;

export default function PlaylistArtists({ artists }: PlaylistArtistsProps) {
  const [showAllArtists, setShowAllArtists] = useState(false);

  const displayedArtists = showAllArtists
    ? artists
    : artists.slice(0, INITIAL_ARTISTS_SHOWN);

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl text-gray-900 sm:text-2xl dark:text-white">
          Artists
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {displayedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
        {artists.length > INITIAL_ARTISTS_SHOWN && (
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

// Artist card component
const ArtistCard = ({ artist }: { artist: PlaylistArtist }) => (
  <a
    href={getSpotifyArtistUrl(artist.id)}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center space-y-2 rounded-lg p-3 text-center transition-colors hover:bg-gray-100 sm:p-4 dark:hover:bg-white/5"
  >
    <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-[#3d38f5]/20 to-[#8b87ff]/10 sm:h-24 sm:w-24">
      <Image
        src={artist.image || getFallbackAvatarUrl(artist.name)}
        alt={artist.name}
        fill
        sizes="(max-width: 640px) 80px, 96px"
        className="object-cover"
        unoptimized={!artist.image}
      />
    </div>
    <div className="w-full truncate px-1 text-xs font-medium text-gray-900 sm:px-2 sm:text-sm dark:text-white">
      {artist.name}
    </div>
    <div className="text-xs text-gray-600 dark:text-gray-400">
      {formatSongCount(artist.songCount)}
    </div>
  </a>
);
