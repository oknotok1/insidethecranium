"use client";

import { ArrowRight, Calendar, MapPin, Music } from "lucide-react";

import Link from "next/link";

import type { ConcertListItem } from "@/types/contentful";

import styles from "./styles.module.scss";

const DESKTOP_LIMIT = 8;

// Type for enriched concert with artist image
type EnrichedConcert = ConcertListItem & { artistImage: string | null };

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

// View All link component
const ViewAllLink = () => (
  <Link
    href="/concerts"
    onClick={scrollToTop}
    className={`${styles.viewAllLink} text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`}
  >
    <span>View All</span>
    <ArrowRight className="h-4 w-4" />
  </Link>
);

// View More Card for mobile carousel
const ViewMoreCard = ({ totalCount }: { totalCount: number }) => (
  <Link href="/concerts" onClick={scrollToTop} className={styles.viewMoreCard}>
    <div
      className={`${styles.viewMoreCardInner} border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/6 dark:hover:border-gray-600 dark:hover:bg-white/11`}
    >
      <h3 className="mb-2 text-center text-base font-medium text-gray-900 sm:text-lg dark:text-white">
        More Concerts
      </h3>
      <p className="mb-4 text-center text-xs text-gray-600 sm:text-sm dark:text-gray-400">
        Explore all {totalCount} shows
      </p>
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <span>View All</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  </Link>
);

// Concert Card Component
const ConcertCard = ({ concert }: { concert: EnrichedConcert }) => {
  const eventDate = new Date(concert.eventDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/concerts/${concert.slug}`}
      className="group block h-full overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 hover:bg-gray-200 dark:bg-white/6 dark:hover:bg-white/11"
    >
      {/* Cover Image */}
      <div className="relative aspect-2/3 w-full overflow-hidden bg-gray-100 dark:bg-white/5">
        {concert.coverImageUrl ? (
          <img
            src={concert.coverImageUrl}
            alt={concert.coverImageAlt || concert.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : concert.artistImage ? (
          <img
            src={concert.artistImage}
            alt={concert.artistBand}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Music className="h-12 w-12 text-gray-400 dark:text-gray-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-3 line-clamp-2 text-base leading-tight font-medium text-gray-900 sm:text-lg dark:text-white">
          {concert.artistBand}
        </h3>
        <div className="flex flex-col space-y-1.5 text-xs text-gray-500 dark:text-gray-500">
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{concert.venueName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

interface ConcertsProps {
  concerts: EnrichedConcert[];
}

export default function Concerts({ concerts }: ConcertsProps) {
  if (!concerts?.length) return null;

  const displayedConcerts = concerts.slice(0, DESKTOP_LIMIT);
  const totalCount = concerts.length;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Concert Memories</h2>
            <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
              A collection of {totalCount} live music experiences. From intimate
              venues to grand stages, each concert tells a unique story worth
              reliving.
            </p>
          </div>
          <ViewAllLink />
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className={styles.mobileCarouselWrapper}>
          <div className={styles.mobileCarousel}>
            {displayedConcerts.map((concert, index) => (
              <div
                key={concert.id}
                className={`${styles.concertCard} ${index === 0 ? styles.concertCardFirst : ""}`}
              >
                <div className={styles.concertCardInner}>
                  <ConcertCard concert={concert} />
                </div>
              </div>
            ))}
            <ViewMoreCard totalCount={totalCount} />
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className={styles.desktopGrid}>
          {displayedConcerts.map((concert) => (
            <div key={concert.id} className={styles.concertCardWrapper}>
              <ConcertCard concert={concert} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
