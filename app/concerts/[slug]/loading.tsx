export default function Loading() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl pb-12 pt-20 sm:pb-20 sm:pt-24">
      {/* Header Section Skeleton */}
      <div className="mb-8 px-4 sm:mb-12 sm:px-6 lg:px-8">
        {/* Back Link Skeleton */}
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200 sm:mb-8 dark:bg-white/10" />

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

          {/* Reflection Skeleton */}
          <div className="max-w-4xl space-y-2 rounded-lg bg-gray-100 p-4 sm:p-6 dark:bg-white/5">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          </div>
        </div>
      </div>

      {/* Media Gallery Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8">
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
    </div>
  );
}
