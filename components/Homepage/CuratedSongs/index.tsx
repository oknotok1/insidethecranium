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
  const displayedMobileTracks = showAllMobile
    ? tracks
    : tracks.slice(0, desktopLimit);
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl">
            Current Earworms
          </h2>
          <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
            I'm digging these songs
          </p>
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="-mx-4 block overflow-hidden sm:-mx-6 lg:hidden">
          <div className="scrollbar-hide flex items-stretch gap-4 overflow-x-scroll">
            {displayedMobileTracks.map((track, index) => (
              <div
                key={track.id}
                className={`w-[45%] max-w-[200px] min-w-[160px] shrink-0 md:w-[30%] md:max-w-[240px] ${
                  index === 0 ? "ml-4 sm:ml-6" : ""
                } ${
                  index === displayedMobileTracks.length - 1 &&
                  (!hasMore || showAllMobile)
                    ? "mr-4 sm:mr-6"
                    : ""
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
                className="mr-4 flex w-[45%] max-w-[200px] min-w-[160px] shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-gray-400 hover:bg-gray-100 sm:mr-6 md:w-[30%] md:max-w-[240px] dark:border-gray-700 dark:bg-white/5 dark:hover:border-gray-600 dark:hover:bg-white/10"
              >
                <h3 className="mb-2 text-center text-base font-medium text-gray-900 sm:text-lg dark:text-white">
                  Show All
                </h3>
                <p className="text-center text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                  View all {tracks.length} songs
                </p>
              </button>
            )}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:grid xl:grid-cols-5">
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
            className="mt-6 hidden rounded-lg px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:block dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </section>
  );
}
