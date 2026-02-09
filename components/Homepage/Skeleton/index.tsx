export default function HomepageSectionSkeleton() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-white/2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <div className="h-8 sm:h-10 w-64 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-3"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5"
            >
              {/* Image skeleton */}
              <div className="aspect-square bg-gray-200 dark:bg-white/10 animate-pulse"></div>

              {/* Content skeleton */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-3/4"></div>

                {/* Subtitle */}
                <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-1/2"></div>

                {/* Genre tags */}
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more button skeleton */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <div className="h-11 w-36 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
