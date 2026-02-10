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
  const [showAllMobile, setShowAllMobile] = useState(false);

  if (!tracks || tracks.length === 0) return null;

  // Desktop: 2 rows = 10 tracks
  // Show all tracks when showAll is true
  const desktopLimit = 10;

  const displayedTracks = showAll ? tracks : tracks.slice(0, desktopLimit);
  const displayedMobileTracks = showAllMobile ? tracks : tracks.slice(0, desktopLimit);
  const hasMore = tracks.length > desktopLimit;

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

  const handleMobileToggle = () => {
    if (showAllMobile) {
      // Scroll to section top when collapsing
      const section = document.getElementById("featured-songs");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setShowAllMobile(!showAllMobile);
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

        {/* Mobile: Horizontal scroll carousel */}
        <div className="block lg:hidden overflow-hidden -mx-4 sm:-mx-6">
          <div className="flex overflow-x-scroll scrollbar-hide gap-4 items-stretch">
            {displayedMobileTracks.map((track, index) => (
              <div
                key={track.id}
                className={`shrink-0 w-[45%] min-w-[160px] max-w-[200px] md:w-[30%] md:max-w-[240px] ${
                  index === 0 ? 'ml-4 sm:ml-6' : ''
                } ${
                  index === displayedMobileTracks.length - 1 && (!hasMore || showAllMobile)
                    ? 'mr-4 sm:mr-6'
                    : ''
                }`}
              >
                <div className="h-full">
                  <MusicCard
                    title={track.name}
                    subtitle={track.artists[0]?.name}
                    genres={track.genres}
                    artwork={track.album.images[0]?.url}
                    spotifyUrl={`https://open.spotify.com/track/${track.id}`}
                    className="h-full"
                  />
                </div>
              </div>
            ))}
            {/* Expand/Collapse Card */}
            {hasMore && !showAllMobile && (
              <button
                onClick={handleMobileToggle}
                className="shrink-0 w-[45%] min-w-[160px] max-w-[200px] md:w-[30%] md:max-w-[240px] mr-4 sm:mr-6 flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
                  Show All
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
                  View all {tracks.length} songs
                </p>
              </button>
            )}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
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
            className="mt-6 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 hidden lg:block"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </section>
  );
}
