import { ConcertPreviewSkeleton } from "@/components/Concerts/ConcertPreviewSkeleton";
import { UpcomingShowCardSkeleton } from "@/components/Concerts/UpcomingShowCard/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
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

          {/* Confirmed Shows Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center space-x-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <div className="h-6 w-40 animate-pulse rounded bg-gray-200 sm:h-7 dark:bg-white/10" />
            </div>

            {/* Show Cards Skeleton */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <UpcomingShowCardSkeleton key={i} />
              ))}
            </div>
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
                className="rounded-lg bg-gray-50 p-4 dark:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
                  <div className="flex-1 space-y-1">
                    {/* Artist Name (Title) */}
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                    {/* Subtitle */}
                    <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                    {/* Date */}
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
    </main>
  );
}
