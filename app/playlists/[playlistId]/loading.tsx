// Constants
const GENRE_SKELETON_COUNT = 5;
const ARTIST_SKELETON_COUNT = 12;
const TRACK_SKELETON_COUNT = 10;
const METADATA_SKELETON_COUNT = 4;

export default function Loading() {
  return (
    <main className="flex flex-col">
      {/* Header Skeleton */}
      <section className="py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Button Skeleton */}
          <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200 sm:mb-5 dark:bg-white/10" />

          <div className="flex flex-col gap-5 sm:gap-6 md:flex-row">
            {/* Image Skeleton */}
            <div className="mx-auto h-48 w-48 shrink-0 animate-pulse rounded-lg bg-gray-200 sm:h-56 sm:w-56 md:mx-0 md:h-64 md:w-64 dark:bg-white/10" />

            {/* Info Skeleton */}
            <div className="flex flex-1 flex-col">
              {/* "Playlist" label skeleton */}
              <div className="mb-1.5 h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />

              {/* Title skeleton */}
              <div className="mb-3 h-12 w-3/4 animate-pulse rounded bg-gray-200 sm:mb-4 dark:bg-white/10" />

              {/* Description skeleton */}
              <div className="mb-4 h-4 w-full animate-pulse rounded bg-gray-200 sm:mb-5 dark:bg-white/10" />

              {/* Metadata skeleton */}
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {Array.from({ length: METADATA_SKELETON_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10"
                  />
                ))}
              </div>

              {/* Button skeleton */}
              <div className="mt-4 h-10 w-40 animate-pulse rounded-full bg-gray-200 sm:mt-5 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Genres Skeleton - Progress bar style */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 h-7 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="space-y-2 sm:space-y-3">
            {Array.from({ length: GENRE_SKELETON_COUNT }).map((_, i) => {
              // Vary the progress bar fill widths for more realistic skeleton
              const fillPercentage = [80, 60, 45, 30, 20][i] || 15;
              return (
                <div
                  key={i}
                  className="relative h-12 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-white/6"
                >
                  {/* Animated fill layer */}
                  <div
                    className="absolute inset-y-0 left-0 animate-pulse bg-gray-200/50 dark:bg-white/12"
                    style={{ width: `${fillPercentage}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Artists Skeleton */}
      <section className="bg-gray-50 py-6 sm:py-8 dark:bg-white/2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 h-7 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: ARTIST_SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200 sm:h-24 sm:w-24 dark:bg-white/10" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Skeleton */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 h-7 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="space-y-2">
            {Array.from({ length: TRACK_SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-white/10"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
