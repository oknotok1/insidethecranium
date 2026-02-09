import { HeroBackground } from "./Background";
import styles from "./styles.module.scss";

export function HeroSkeleton() {
  return (
    <section id="now-playing" className={styles.heroSection}>
      <HeroBackground />

      <div className={styles.content}>
        {/* Listening label skeleton */}
        <div className={styles.listeningLabel}>
          <div className="h-5 sm:h-6 w-48 min-w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse mx-auto"></div>
        </div>

        {/* Album artwork skeleton */}
        <div className={styles.albumContainer}>
          <div className="w-48 h-48 sm:w-64 sm:h-64 min-w-48 sm:min-w-64 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse shadow-2xl"></div>
        </div>

        {/* Title skeleton */}
        <div className={styles.title}>
          <div className="h-10 sm:h-12 md:h-14 lg:h-16 w-3/4 min-w-64 max-w-2xl bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mx-auto"></div>
        </div>

        {/* Artist skeleton */}
        <div className={styles.artist}>
          <div className="h-6 sm:h-7 md:h-8 w-1/2 min-w-48 max-w-md bg-gray-200 dark:bg-white/10 rounded animate-pulse mx-auto"></div>
        </div>

        {/* Album skeleton */}
        <div className={styles.album}>
          <div className="h-4 sm:h-5 w-1/3 min-w-40 max-w-xs bg-gray-200 dark:bg-white/10 rounded animate-pulse mx-auto"></div>
        </div>

        {/* Genres/metadata skeleton */}
        <div className={styles.metadata}>
          <div className="h-4 w-16 min-w-16 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
          <div className="h-4 w-20 min-w-20 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
          <div className="h-4 w-24 min-w-24 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
        </div>

        {/* Spotify link button skeleton */}
        <div className={styles.spotifyLinkContainer}>
          <div className="h-9 sm:h-10 w-40 min-w-40 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
        </div>

        {/* Timestamp skeleton */}
        <div className={styles.timestampContainer}>
          <div className="h-4 w-48 min-w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
