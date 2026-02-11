"use client";

import { useState } from "react";

import MusicCard from "@/components/Music/MusicCard";

import type { TrackWithGenres } from "@/types/spotify";

import styles from "./styles.module.scss";

const DISPLAY_LIMIT = 10;

const scrollToSection = () => {
  const section = document.getElementById("featured-songs");
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const getSpotifyTrackUrl = (trackId: string) =>
  `https://open.spotify.com/track/${trackId}`;

// Show All button for mobile carousel
const ShowAllButton = ({
  onClick,
  totalCount,
}: {
  onClick: () => void;
  totalCount: number;
}) => (
  <button
    onClick={onClick}
    className={`${styles.showAllButton} border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:hover:border-gray-600 dark:hover:bg-white/10`}
  >
    <h3 className="mb-2 text-center text-base font-medium text-gray-900 sm:text-lg dark:text-white">
      Show All
    </h3>
    <p className="text-center text-xs text-gray-600 sm:text-sm dark:text-gray-400">
      View all {totalCount} songs
    </p>
  </button>
);

export default function CuratedSongs({
  tracks = [],
}: {
  tracks?: TrackWithGenres[];
}) {
  const [showAll, setShowAll] = useState(false);
  const [showAllMobile, setShowAllMobile] = useState(false);

  if (!tracks?.length) return null;

  const displayedTracks = showAll ? tracks : tracks.slice(0, DISPLAY_LIMIT);
  const displayedMobileTracks = showAllMobile
    ? tracks
    : tracks.slice(0, DISPLAY_LIMIT);
  const hasMore = tracks.length > DISPLAY_LIMIT;

  const handleToggle = () => {
    if (showAll) scrollToSection();
    setShowAll(!showAll);
  };

  const handleMobileToggle = () => {
    if (showAllMobile) scrollToSection();
    setShowAllMobile(!showAllMobile);
  };

  const renderTrack = (track: TrackWithGenres) => (
    <MusicCard
      key={track.id}
      title={track.name}
      subtitle={track.artists[0]?.name}
      genres={track.genres}
      artwork={track.album.images[0]?.url}
      spotifyUrl={getSpotifyTrackUrl(track.id)}
      className={styles.mobileTrackCardInner}
      trackId={track.id}
      album={track.album.name}
      artists={track.artists.map(artist => ({
        name: artist.name,
        external_urls: artist.external_urls,
      }))}
    />
  );

  const getMobileCardClassName = (index: number, isLast: boolean) => {
    const classes = [styles.mobileTrackCard];
    if (index === 0) classes.push(styles.mobileTrackCardFirst);
    if (isLast && (!hasMore || showAllMobile))
      classes.push(styles.mobileTrackCardLast);
    return classes.join(" ");
  };

  return (
    <section id="featured-songs" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Current Earworms</h2>
          <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
            I'm digging these songs
          </p>
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className={styles.mobileCarouselWrapper}>
          <div className={styles.mobileCarousel}>
            {displayedMobileTracks.map((track, index) => {
              const isLast = index === displayedMobileTracks.length - 1;
              return (
                <div
                  key={track.id}
                  className={getMobileCardClassName(index, isLast)}
                >
                  <div className={styles.mobileTrackCardInner}>
                    {renderTrack(track)}
                  </div>
                </div>
              );
            })}
            {hasMore && !showAllMobile && (
              <ShowAllButton
                onClick={handleMobileToggle}
                totalCount={tracks.length}
              />
            )}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className={styles.desktopGrid}>
          {displayedTracks.map((track) => renderTrack(track))}
        </div>

        {hasMore && (
          <button
            onClick={handleToggle}
            className={`${styles.toggleButton} border-gray-300 bg-gray-50 text-gray-900 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:text-white dark:hover:border-gray-600 dark:hover:bg-white/10`}
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </section>
  );
}
