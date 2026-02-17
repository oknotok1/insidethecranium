import { JumpToConcertCard } from "./JumpToConcertCard";
import { ConcertPreview } from "./ConcertPreview";

import type { ConcertListItem, ConcertDetail } from "@/types/contentful";

type EnrichedConcertList = ConcertListItem & { artistImage: string | null };
type EnrichedConcertDetailed = ConcertDetail & { artistSpotifyUrl?: string | null };

interface ConcertArchiveSectionProps {
  pastConcertsList: EnrichedConcertList[];
  pastConcerts: EnrichedConcertDetailed[];
}

export function ConcertArchiveSection({ pastConcertsList, pastConcerts }: ConcertArchiveSectionProps) {
  if (pastConcerts.length === 0) return null;

  return (
    <>
      <div className="mb-8 sm:mb-12">
        <h2 className="mb-2 text-2xl text-gray-900 sm:text-3xl dark:text-white">
          Concert Archive
        </h2>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          {pastConcerts.length} shows and counting
        </p>
      </div>

      {/* Concert Navigation */}
      <div className="mb-16 sm:mb-20">
        <h3 className="mb-4 text-xl text-gray-900 sm:mb-6 sm:text-2xl dark:text-white">
          Jump to Concert
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
          {pastConcertsList.map((concert) => (
            <JumpToConcertCard key={concert.id} concert={concert} />
          ))}
        </div>
      </div>

      {/* Concert Details with Media */}
      <div className="space-y-16">
        {pastConcerts.map((concert) => (
          <ConcertPreview key={concert.id} concert={concert} />
        ))}
      </div>
    </>
  );
}
