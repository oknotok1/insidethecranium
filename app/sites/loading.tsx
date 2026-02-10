import { SiteCardSkeleton } from "@/components/Sites";

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-4 h-10 w-64 animate-pulse rounded bg-gray-200 sm:mb-6 sm:h-12 dark:bg-white/10" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Tag Filter Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"
              />
            ))}
          </div>
        </div>

        {/* Sites Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SiteCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
