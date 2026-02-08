export default function Loading() {
  return (
    <main className="flex flex-col">
      {/* Header Skeleton */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button Skeleton */}
          <div className="h-5 w-32 bg-gray-200 dark:bg-white/10 rounded mb-6 sm:mb-8 animate-pulse" />

          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            {/* Image Skeleton */}
            <div className="flex-shrink-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto md:mx-0 rounded-lg bg-gray-200 dark:bg-white/10 animate-pulse" />

            {/* Info Skeleton */}
            <div className="flex-1 flex flex-col justify-end space-y-4">
              <div className="h-3 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-12 w-3/4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              <div className="flex flex-wrap gap-2 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded animate-pulse"
                  />
                ))}
              </div>
              <div className="h-10 w-40 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Genres Skeleton */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-7 w-24 bg-gray-200 dark:bg-white/10 rounded mb-4 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Artists Skeleton */}
      <section className="py-6 sm:py-8 bg-gray-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-7 w-24 bg-gray-200 dark:bg-white/10 rounded mb-4 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Skeleton */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-7 w-24 bg-gray-200 dark:bg-white/10 rounded mb-4 animate-pulse" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="h-16 w-full bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
