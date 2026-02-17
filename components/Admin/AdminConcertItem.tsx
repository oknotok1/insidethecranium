import Link from "next/link";
import ConcertActions from "./ConcertActions";

import type { ConcertListItem } from "@/types/contentful";

interface AdminConcertItemProps {
  concert: ConcertListItem & { published: boolean };
  contentfulSpaceId: string;
}

export function AdminConcertItem({ concert, contentfulSpaceId }: AdminConcertItemProps) {
  const eventDate = new Date(concert.eventDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 sm:flex-row dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/8">
      {/* Cover Image */}
      {concert.coverImageUrl && (
        <img
          src={concert.coverImageUrl}
          alt={concert.coverImageAlt || concert.title}
          className="h-32 w-full rounded-lg object-cover sm:h-auto sm:w-48"
        />
      )}

      {/* Content */}
      <div className="flex flex-1 gap-4">
        <div className="flex flex-1 flex-col justify-between">
          <div className="space-y-3">
            <div>
              <Link
                href={`/concerts/${concert.slug}`}
                className="mb-1 inline-block text-lg font-semibold text-gray-900 transition-colors hover:text-[#3d38f5] dark:text-white dark:hover:text-[#8b87ff]"
              >
                {concert.title}
              </Link>
              {concert.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {concert.subtitle}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium text-gray-900 dark:text-white">
                {concert.artistBand}
              </span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span>{concert.venueName}</span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span>{formattedDate}</span>
            </div>
            
            {concert.genres && concert.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {concert.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-white/10 dark:text-gray-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <ConcertActions
          concertId={concert.id}
          concertTitle={concert.title}
          published={concert.published}
          contentfulSpaceId={contentfulSpaceId}
        />
      </div>
    </div>
  );
}
