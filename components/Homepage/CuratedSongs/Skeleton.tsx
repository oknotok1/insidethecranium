import MusicCardSkeleton from "@/components/Music/MusicCard/Skeleton";

export default function CuratedSongsSkeleton() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="h-8 sm:h-10 w-56 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="block lg:hidden overflow-hidden -mx-4 sm:-mx-6">
          <div className="flex overflow-x-scroll scrollbar-hide gap-4 items-stretch">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`shrink-0 w-[45%] min-w-[160px] max-w-[200px] md:w-[30%] md:max-w-[240px] ${
                  i === 0 ? 'ml-4 sm:ml-6' : ''
                } ${i === 7 ? 'mr-4 sm:mr-6' : ''}`}
              >
                <div className="h-full">
                  <MusicCardSkeleton />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <MusicCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
