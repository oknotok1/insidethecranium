export default function Loading() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Back Link Skeleton */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      </div>

      {/* Header Section Skeleton */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6">
            {/* Title Skeleton */}
            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200 sm:h-12 md:h-14 lg:h-16 dark:bg-white/10" />

            {/* Subtitle Skeleton */}
            <div className="h-6 w-1/2 animate-pulse rounded bg-gray-200 sm:h-7 dark:bg-white/10" />

            {/* Details Strip Skeleton */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                <div className="h-5 w-36 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                <div className="h-5 w-28 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
              </div>

              {/* Genre Tags Skeleton */}
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reflection Section Skeleton */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-2 rounded-lg bg-gray-100 p-4 sm:p-6 dark:bg-white/5">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          </div>
        </div>
      </section>

      {/* Media Gallery Section Skeleton */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 h-7 w-48 animate-pulse rounded bg-gray-200 sm:mb-6 sm:h-8 dark:bg-white/10" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="aspect-9/16 animate-pulse rounded-lg bg-gray-200 dark:bg-white/5"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
