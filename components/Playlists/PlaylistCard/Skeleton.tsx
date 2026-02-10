export default function PlaylistCardSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-50 dark:border-white/[0.025] rounded-lg shadow-card h-full">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 dark:bg-white/10 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title/Description group */}
        <div className="mb-3">
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-1" />
          <div className="space-y-1">
            <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-2/3 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        {/* Genre chips */}
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        {/* Song Count - pushed to bottom */}
        <div className="flex items-center space-x-2 mt-auto">
          <div className="h-4 w-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
