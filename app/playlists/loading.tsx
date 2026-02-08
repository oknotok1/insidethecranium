export default function Loading() {
  return (
    <main className="flex flex-col">
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8 sm:mb-12">
            <div className="h-10 sm:h-12 w-64 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-4 sm:mb-6" />
            <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5"
              >
                {/* Image Skeleton */}
                <div className="aspect-square bg-gray-200 dark:bg-white/10 animate-pulse" />

                {/* Content Skeleton */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />

                  {/* Description */}
                  <div className="space-y-1">
                    <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                  </div>

                  {/* Song Count */}
                  <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
