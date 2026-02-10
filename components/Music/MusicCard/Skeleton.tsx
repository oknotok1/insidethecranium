export default function MusicCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 border border-gray-50 dark:border-white/[0.025] shadow-card h-full">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 dark:bg-white/10 animate-pulse" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-3/4" />

        {/* Subtitle */}
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-1/2" />

        {/* Genre tags */}
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
