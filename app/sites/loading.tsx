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
            <div
              key={i}
              className="rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-50 dark:border-white/[0.025] shadow-card"
            >
              {/* Image Skeleton */}
              <div className="aspect-video bg-gray-200 dark:bg-white/10 animate-pulse" />

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />

                {/* Description */}
                <div className="space-y-1">
                  <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                </div>

                {/* Tags */}
                <div className="flex gap-1">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                  <div className="h-5 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
