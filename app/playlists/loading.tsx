import { PlaylistCardSkeleton } from "@/components/Playlists/PlaylistCard";

export default function Loading() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-12">
          <div className="h-10 sm:h-12 w-64 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-4 sm:mb-6" />
          <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <PlaylistCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
