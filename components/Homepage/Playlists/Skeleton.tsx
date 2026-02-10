import PlaylistCardSkeleton from "@/components/Playlists/PlaylistCard/Skeleton";

export default function PlaylistsSkeleton() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200 sm:h-10 dark:bg-white/10" />
            <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          </div>
          <div className="hidden h-6 w-24 animate-pulse rounded bg-gray-200 lg:block dark:bg-white/10" />
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="-mx-4 block overflow-hidden sm:-mx-6 lg:hidden">
          <div className="scrollbar-hide flex items-stretch gap-4 overflow-x-scroll">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`w-[45%] max-w-[200px] min-w-[160px] shrink-0 md:w-[30%] md:max-w-[240px] ${
                  i === 0 ? "ml-4 sm:ml-6" : ""
                } ${i === 7 ? "mr-4 sm:mr-6" : ""}`}
              >
                <PlaylistCardSkeleton />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:grid xl:grid-cols-5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i}>
              <PlaylistCardSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
