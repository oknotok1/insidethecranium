export default function PlaylistCardSkeleton() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5">
      {/* Image Skeleton */}
      <div className="aspect-square animate-pulse bg-gray-200 dark:bg-white/10" />

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title/Description group */}
        <div className="mb-3">
          <div className="mb-1 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="space-y-1">
            <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          </div>
        </div>

        {/* Genre chips */}
        <div className="mb-4">
          <div className="flex gap-2">
            <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          </div>
        </div>

        {/* Song Count - pushed to bottom */}
        <div className="mt-auto flex items-center space-x-2">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}
