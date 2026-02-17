interface ConcertsPageHeaderProps {
  pastCount: number;
  upcomingCount: number;
}

export function ConcertsPageHeader({ pastCount, upcomingCount }: ConcertsPageHeaderProps) {
  return (
    <div className="mb-8 sm:mb-12">
      <h1 className="mb-4 text-3xl text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl dark:text-white">
        Concerts
      </h1>
      <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
        {pastCount} shows attended • {upcomingCount} upcoming
      </p>
    </div>
  );
}
