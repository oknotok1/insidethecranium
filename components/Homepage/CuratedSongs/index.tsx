"use client";

import { useState } from "react";
import MusicCard from "@/components/Music/MusicCard";

interface TrackWithGenres {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  genres: string[];
}

export default function CuratedSongs({
  tracks = [],
}: {
  tracks?: TrackWithGenres[];
}) {
  const [showAll, setShowAll] = useState(false);

  if (!tracks || tracks.length === 0) return null;

  // Calculate how many tracks to show:
  // Mobile (2 cols): 3 rows = 6 tracks
  // Desktop (5 cols): 2 rows = 10 tracks
  // Show all tracks when showAll is true
  const mobileLimit = 6;
  const desktopLimit = 10;

  const displayedTracks = showAll
    ? tracks
    : tracks.slice(0, Math.max(mobileLimit, desktopLimit));
  const hasMore = tracks.length > Math.max(mobileLimit, desktopLimit);

  const handleToggle = () => {
    if (showAll) {
      // Scroll to section top when collapsing
      const section = document.getElementById("featured-songs");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setShowAll(!showAll);
  };

  return (
    <section id="featured-songs" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl">
            Current Earworms
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            I'm digging these songs
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {displayedTracks.map((track) => (
            <MusicCard
              key={track.id}
              title={track.name}
              subtitle={track.artists[0]?.name}
              genres={track.genres}
              artwork={track.album.images[0]?.url}
              spotifyUrl={`https://open.spotify.com/track/${track.id}`}
            />
          ))}
        </div>

        {hasMore && (
          <button
            onClick={handleToggle}
            className="mt-6 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </section>
  );
}
