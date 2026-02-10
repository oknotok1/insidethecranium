"use client";

import { ArrowRight } from "lucide-react";

import Link from "next/link";

import PlaylistCard from "@/components/Playlists/PlaylistCard";

import { UserPlaylists } from "@/types/spotify";

import styles from "./styles.module.scss";

const DESKTOP_LIMIT = 15;

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

// View All link component
const ViewAllLink = () => (
  <Link
    href="/playlists"
    onClick={scrollToTop}
    className={`${styles.viewAllLink} text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`}
  >
    <span>View All</span>
    <ArrowRight className="h-4 w-4" />
  </Link>
);

// View More Card for mobile carousel
const ViewMoreCard = ({ totalCount }: { totalCount: number }) => (
  <Link href="/playlists" onClick={scrollToTop} className={styles.viewMoreCard}>
    <div
      className={`${styles.viewMoreCardInner} border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:hover:border-gray-600 dark:hover:bg-white/10`}
    >
      <h3 className="mb-2 text-center text-base font-medium text-gray-900 sm:text-lg dark:text-white">
        More Playlists
      </h3>
      <p className="mb-4 text-center text-xs text-gray-600 sm:text-sm dark:text-gray-400">
        Explore all {totalCount} playlists
      </p>
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <span>View All</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  </Link>
);

export default function Playlists({ playlists }: { playlists: UserPlaylists }) {
  if (!playlists?.items?.length) return null;

  const featuredPlaylists = playlists.items.slice(0, DESKTOP_LIMIT);
  const totalCount = playlists.total || playlists.items.length;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>My Playlists</h2>
            <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
              I have curated <strong>{totalCount}</strong> playlists thus far.
              They're mostly grouped by genres, and or moods. I know it's
              excessive, but I can't help it. I'll be creating a directory soon
              to help you navigate through them.
            </p>
          </div>
          <ViewAllLink />
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className={styles.mobileCarouselWrapper}>
          <div className={styles.mobileCarousel}>
            {featuredPlaylists.map((playlist, index) => (
              <div
                key={playlist.id}
                className={`${styles.playlistCard} ${index === 0 ? styles.playlistCardFirst : ""}`}
              >
                <div className={styles.playlistCardInner}>
                  <PlaylistCard playlist={playlist} />
                </div>
              </div>
            ))}
            <ViewMoreCard totalCount={totalCount} />
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className={styles.desktopGrid}>
          {featuredPlaylists.map((playlist) => (
            <div key={playlist.id} className={styles.playlistCardWrapper}>
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
