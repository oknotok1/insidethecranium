import { HeroBackground } from "./Background";
import styles from "./styles.module.scss";

export function HeroSkeleton() {
  return (
    <section id="now-playing" className={styles.heroSection}>
      <HeroBackground />

      <div className={styles.content}>
        <div className={styles.mainContent}>
          {/* Listening label skeleton */}
          <div className={styles.listeningLabel}>
            <div className="mx-auto h-3 w-44 animate-pulse rounded bg-gray-200 sm:h-4 dark:bg-white/10"></div>
          </div>

          {/* Album artwork skeleton */}
          <div className={styles.albumContainer}>
            <div className={styles.albumArtwork}>
              <div className="h-full w-full animate-pulse rounded-lg bg-gray-200 dark:bg-white/10"></div>
            </div>
          </div>

          {/* Title skeleton - single element with text class for proper spacing */}
          <h1 className={styles.title}>
            <span className="inline-block h-9 w-56 animate-pulse rounded-lg bg-gray-200 align-middle sm:h-11 sm:w-72 md:h-12 lg:h-14 dark:bg-white/10"></span>
          </h1>

          {/* Artist skeleton */}
          <p className={styles.artist}>
            <span className="inline-block h-5 w-44 animate-pulse rounded bg-gray-200 align-middle sm:h-6 sm:w-52 md:h-7 dark:bg-white/10"></span>
          </p>

          {/* Album skeleton */}
          <p className={styles.album}>
            <span className="inline-block h-3 w-36 animate-pulse rounded bg-gray-200 align-middle sm:h-4 sm:w-44 dark:bg-white/10"></span>
          </p>

          {/* Genres/metadata skeleton */}
          <div className={styles.metadata}>
            <div className="h-3 w-16 animate-pulse rounded-full bg-gray-200 sm:h-4 dark:bg-white/10"></div>
            <div className="h-3 w-20 animate-pulse rounded-full bg-gray-200 sm:h-4 dark:bg-white/10"></div>
            <div className="h-3 w-24 animate-pulse rounded-full bg-gray-200 sm:h-4 dark:bg-white/10"></div>
          </div>

          {/* Progress bar skeleton */}
          <div className={styles.progressContainer}>
            <span className={styles.progressTime}>
              <div className="h-2.5 w-8 animate-pulse rounded bg-gray-200 sm:h-3 dark:bg-white/10"></div>
            </span>
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBarTrack}>
                <div className="h-full w-1/3 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"></div>
              </div>
            </div>
            <span className={styles.progressTime}>
              <div className="h-2.5 w-10 animate-pulse rounded bg-gray-200 sm:h-3 dark:bg-white/10"></div>
            </span>
          </div>

          {/* Spotify link button skeleton */}
          <div className={styles.spotifyLinkContainer}>
            <div className="h-9 w-44 animate-pulse rounded-full bg-gray-200 sm:h-10 sm:w-48 dark:bg-white/10"></div>
          </div>
        </div>

        {/* Timestamp skeleton */}
        <div className={styles.timestampContainer}>
          <div className={styles.timestamp}>
            <div className="mx-auto h-3 w-44 animate-pulse rounded bg-gray-200 sm:h-4 sm:w-52 dark:bg-white/10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
