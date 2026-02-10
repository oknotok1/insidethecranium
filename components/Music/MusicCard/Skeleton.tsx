export default function MusicCardSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-lg bg-gray-100 dark:bg-white/5">
      {/* Image skeleton */}
      <div className="aspect-square animate-pulse bg-gray-200 dark:bg-white/10" />

      {/* Content skeleton */}
      <div className="space-y-3 p-4">
        {/* Title */}
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />

        {/* Subtitle */}
        <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-white/10" />

        {/* Genre tags */}
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </div>
  );
}
