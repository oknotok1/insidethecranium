import { PlaylistCardSkeleton } from "@/components/Playlists/PlaylistCard";

// Constants
const SKELETON_COUNT = 20;

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="mb-4 h-10 w-64 animate-pulse rounded bg-gray-200 sm:mb-6 sm:h-12 dark:bg-white/10" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <PlaylistCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
