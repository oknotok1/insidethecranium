import { Music } from "lucide-react";

import styles from "./styles.module.scss";

const ConcertCardSkeleton = () => (
  <div className="h-full overflow-hidden rounded-lg bg-gray-100 dark:bg-white/6">
    {/* Cover Image Skeleton */}
    <div className="relative aspect-2/3 w-full overflow-hidden bg-gray-100 dark:bg-white/5">
      <div className="flex h-full items-center justify-center">
        <Music className="h-12 w-12 animate-pulse text-gray-300 dark:text-gray-700" />
      </div>
      
    </div>

    {/* Content Skeleton */}
    <div className="space-y-2 p-4">
      {/* Artist (Title) */}
      <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200 sm:h-6 dark:bg-white/10" />
      {/* Date & Venue */}
      <div className="mt-3 space-y-1.5">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      </div>
    </div>
  </div>
);

export default function ConcertsSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className="mb-4 h-9 w-64 animate-pulse rounded bg-gray-200 sm:h-10 md:h-12 dark:bg-white/10" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          </div>
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className={styles.mobileCarouselWrapper}>
          <div className={styles.mobileCarousel}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`${styles.concertCard} ${i === 0 ? styles.concertCardFirst : ""}`}
              >
                <div className={styles.concertCardInner}>
                  <ConcertCardSkeleton />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className={styles.desktopGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.concertCardWrapper}>
              <ConcertCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
