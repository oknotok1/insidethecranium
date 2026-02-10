import { SiteCardSkeleton } from "@/components/Sites";

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="h-10 sm:h-12 w-64 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-4 sm:mb-6" />
          <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>

        {/* Tag Filter Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 w-24 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Sites Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <SiteCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
