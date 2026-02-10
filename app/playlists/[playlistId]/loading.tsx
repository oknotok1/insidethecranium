export default function Loading() {
  return (
    <main className="flex flex-col">
      {/* Header Skeleton */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Button Skeleton */}
          <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200 sm:mb-8 dark:bg-white/10" />

          <div className="flex flex-col gap-6 sm:gap-8 md:flex-row">
            {/* Image Skeleton */}
            <div className="mx-auto h-48 w-48 shrink-0 animate-pulse rounded-lg bg-gray-200 sm:h-56 sm:w-56 md:mx-0 md:h-64 md:w-64 dark:bg-white/10" />

            {/* Info Skeleton */}
            <div className="flex flex-1 flex-col justify-end space-y-4">
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10"
                  />
                ))}
              </div>
              <div className="h-10 w-40 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Genres Skeleton */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 h-7 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-white/10"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Artists Skeleton */}
      <section className="bg-gray-50 py-6 sm:py-8 dark:bg-white/2">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 h-7 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
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
