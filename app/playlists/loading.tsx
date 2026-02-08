export default function Loading() {
  return (
    <section className="mt-16 py-12 sm:py-16 lg:py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-8 sm:h-10 w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-3" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              {/* Image Skeleton */}
              <div className="aspect-square bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse" />

              {/* Content Skeleton */}
              <div className="space-y-2 px-1">
                {/* Title */}
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />

                {/* Description */}
                <div className="space-y-1">
                  <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-1">
                  <div className="h-5 w-12 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse" />
                  <div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse" />
                </div>

                {/* Song Count */}
                <div className="h-3 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
