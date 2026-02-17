import { UpcomingShowCard } from "./UpcomingShowCard";

import type { ConcertListItem } from "@/types/contentful";

type EnrichedConcert = ConcertListItem & { 
  artistImage: string | null;
  artistSpotifyUrl?: string | null;
};

interface UpcomingShowsSectionProps {
  confirmedShows: EnrichedConcert[];
  onFenceShows: EnrichedConcert[];
}

export function UpcomingShowsSection({ confirmedShows, onFenceShows }: UpcomingShowsSectionProps) {
  const hasShows = confirmedShows.length > 0 || onFenceShows.length > 0;

  if (!hasShows) return null;

  return (
    <div className="mb-16 sm:mb-20">
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-2 text-2xl text-gray-900 sm:text-3xl dark:text-white">
          Upcoming Shows
        </h2>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          Shows I'm going to and considering
        </p>
      </div>

      {/* Confirmed Shows */}
      {confirmedShows.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 flex items-center space-x-2 text-lg text-gray-900 sm:text-xl dark:text-white">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Confirmed ({confirmedShows.length})</span>
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {confirmedShows.map((show) => (
              <UpcomingShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      )}

      {/* On the Fence Shows */}
      {onFenceShows.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 flex items-center space-x-2 text-lg text-gray-900 sm:text-xl dark:text-white">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <span>Considering ({onFenceShows.length})</span>
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {onFenceShows.map((show) => (
              <UpcomingShowCard key={show.id} show={show} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
