export default function SiteCardSkeleton() {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5">
      {/* Image Skeleton */}
      <div className="aspect-video animate-pulse bg-gray-200 dark:bg-white/10" />

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Title */}
        <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />

        {/* Description */}
        <div className="mb-3">
          <div className="mb-1 h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="mb-1 h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>

        {/* Tags */}
        <div className="mb-3 flex flex-1 flex-wrap gap-1.5 sm:gap-2">
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>

        {/* URL Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-2 sm:pt-3 dark:border-white/10">
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}
