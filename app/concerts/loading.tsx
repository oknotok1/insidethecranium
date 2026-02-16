import { ConcertPreviewSkeleton } from "@/components/Concerts/ConcertPreviewSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen pb-12 pt-20 sm:pb-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-4 h-10 w-48 animate-pulse rounded bg-gray-200 sm:mb-6 sm:h-12 dark:bg-white/10" />
          <div className="h-4 w-64 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Upcoming Shows Section Skeleton */}
        <div className="mb-16 sm:mb-20">
          <div className="mb-6 sm:mb-8">
            <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200 sm:h-9 dark:bg-white/10" />
            <div className="h-4 w-80 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          </div>

          {/* Show Cards Skeleton */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg bg-gray-100 p-4 dark:bg-white/5"
              >
                {/* Artist Image & Info */}
                <div className="mb-4 flex gap-4">
                  <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                    <div className="flex gap-2">
                      <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                      <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="mb-4 space-y-2.5">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                </div>

                {/* Button */}
                <div className="border-t border-gray-200 pt-3 dark:border-white/10">
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concert Archive Section Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200 sm:h-9 dark:bg-white/10" />
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Jump to Concert Skeleton */}
        <div className="mb-16 sm:mb-20">
          <div className="mb-4 h-7 w-48 animate-pulse rounded bg-gray-200 sm:mb-6 sm:h-8 dark:bg-white/10" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-lg bg-gray-100 p-4 dark:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Concert Previews Skeleton */}
        <div className="space-y-16">
          {[1, 2].map((i) => (
            <ConcertPreviewSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

