import { HeroBackground } from "./Background";
import styles from "./styles.module.scss";

export function HeroSkeleton() {
  return (
    <section id="now-playing" className={styles.heroSection}>
      <HeroBackground />

      <div className={styles.content}>
        {/* Listening label skeleton */}
        <div className={styles.listeningLabel}>
          <div className="mx-auto h-5 w-48 min-w-48 animate-pulse rounded bg-gray-200 sm:h-6 dark:bg-white/10"></div>
        </div>

        {/* Album artwork skeleton */}
        <div className={styles.albumContainer}>
          <div className="h-48 w-48 min-w-48 animate-pulse rounded-lg bg-gray-200 shadow-2xl sm:h-64 sm:w-64 sm:min-w-64 dark:bg-white/10"></div>
        </div>

        {/* Title skeleton */}
        <div className={styles.title}>
          <div className="mx-auto h-10 w-3/4 max-w-2xl min-w-64 animate-pulse rounded-lg bg-gray-200 sm:h-12 md:h-14 lg:h-16 dark:bg-white/10"></div>
        </div>

        {/* Artist skeleton */}
        <div className={styles.artist}>
          <div className="mx-auto h-6 w-1/2 max-w-md min-w-48 animate-pulse rounded bg-gray-200 sm:h-7 md:h-8 dark:bg-white/10"></div>
        </div>

        {/* Album skeleton */}
        <div className={styles.album}>
          <div className="mx-auto h-4 w-1/3 max-w-xs min-w-40 animate-pulse rounded bg-gray-200 sm:h-5 dark:bg-white/10"></div>
        </div>

        {/* Genres/metadata skeleton */}
        <div className={styles.metadata}>
          <div className="h-4 w-16 min-w-16 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"></div>
          <div className="h-4 w-20 min-w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"></div>
          <div className="h-4 w-24 min-w-24 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"></div>
        </div>

        {/* Spotify link button skeleton */}
        <div className={styles.spotifyLinkContainer}>
          <div className="h-9 w-40 min-w-40 animate-pulse rounded-full bg-gray-200 sm:h-10 dark:bg-white/10"></div>
        </div>

        {/* Timestamp skeleton */}
        <div className={styles.timestampContainer}>
          <div className="h-4 w-48 min-w-48 animate-pulse rounded bg-gray-200 dark:bg-white/10"></div>
        </div>
      </div>
    </section>
  );
}
