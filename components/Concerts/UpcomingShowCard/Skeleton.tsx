export const UpcomingShowCardSkeleton = () => (
  <div className="rounded-lg bg-gray-50 p-4 dark:bg-white/6">
    {/* Artist Image & Info */}
    <div className="mb-4 flex gap-4">
      <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
        </div>
      </div>
    </div>

    {/* Details */}
    <div className="mb-4 space-y-2.5">
      <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
    </div>

    {/* Button */}
    <div className="border-gray-200 dark:border-white/10">
      <div className="h-10 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-white/10" />
    </div>
  </div>
);
