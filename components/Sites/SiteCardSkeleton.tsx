export default function SiteCardSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden bg-gray-100 dark:bg-white/5 rounded-lg h-full">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-white/10 animate-pulse" />

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col p-3 sm:p-4">
        {/* Title */}
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-2" />

        {/* Description */}
        <div className="mb-3">
          <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-1" />
          <div className="h-3 w-5/6 bg-gray-200 dark:bg-white/10 rounded animate-pulse mb-1" />
          <div className="h-3 w-4/5 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 flex-1">
          <div className="h-5 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-5 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>

        {/* URL Footer */}
        <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200 dark:border-white/10">
          <div className="h-3 w-32 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
