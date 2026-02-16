import MusicCardSkeleton from "@/components/Music/MusicCard/Skeleton";
import { CarouselSkeletonItem } from "@/components/Homepage/Skeleton/CarouselWrapper";

export default function CuratedSongsSkeleton() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-4 h-8 w-56 animate-pulse rounded bg-gray-200 sm:h-10 dark:bg-white/10" />
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="-mx-4 block overflow-hidden sm:-mx-6 lg:hidden">
          <div className="scrollbar-hide flex items-stretch gap-4 overflow-x-scroll">
            {Array.from({ length: 8 }).map((_, i) => (
              <CarouselSkeletonItem key={i} index={i} totalItems={8}>
                <MusicCardSkeleton />
              </CarouselSkeletonItem>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:grid xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <MusicCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
