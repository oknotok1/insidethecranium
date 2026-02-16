export function ConcertPreviewSkeleton() {
  return (
    <article className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-4">
          {/* Title */}
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200 sm:h-9 dark:bg-white/10" />
          
          {/* Subtitle */}
          <div className="h-4 w-full max-w-lg animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          
          {/* Details Strip */}
          <div className="flex flex-wrap gap-4">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-5 w-36 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          </div>
          
          {/* Genre Tags */}
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
          </div>
        </div>
        
        {/* View Link (Desktop) */}
        <div className="hidden sm:block">
          <div className="h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>

      {/* View Link (Mobile) */}
      <div className="sm:hidden">
        <div className="h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      </div>

      {/* Media Grid Skeleton - 6 items */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-9/16 animate-pulse rounded-lg bg-gray-200 dark:bg-white/5"
          />
        ))}
      </div>

      {/* Reflection Skeleton */}
      <div className="max-w-4xl space-y-2 rounded-lg bg-gray-100 p-4 sm:p-6 dark:bg-white/5">
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      </div>
    </article>
  );
}
