export default function HomepageSectionSkeleton() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <div className="mb-3 h-8 w-64 animate-pulse rounded-lg bg-gray-200 sm:h-10 dark:bg-white/10"></div>
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-white/10"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5"
            >
              {/* Image skeleton */}
              <div className="aspect-square animate-pulse bg-gray-200 dark:bg-white/10"></div>

              {/* Content skeleton */}
              <div className="space-y-3 p-4">
                {/* Title */}
                <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10"></div>

                {/* Subtitle */}
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-white/10"></div>

                {/* Genre tags */}
                <div className="flex gap-2">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"></div>
                  <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more button skeleton */}
        <div className="mt-8 flex justify-center sm:mt-12">
          <div className="h-11 w-36 animate-pulse rounded-full bg-gray-200 dark:bg-white/10"></div>
        </div>
      </div>
    </section>
  );
}
