import Link from "next/link";
import { Music } from "lucide-react";

import type { ConcertListItem } from "@/types/contentful";

type EnrichedConcert = ConcertListItem & { 
  artistImage: string | null;
  firstGalleryImage?: string | null;
};

interface JumpToConcertCardProps {
  concert: EnrichedConcert;
}

export function JumpToConcertCard({ concert }: JumpToConcertCardProps) {
  return (
    <Link
      href={`#${concert.slug}`}
      className="group rounded-lg bg-gray-50 p-4 transition-all hover:bg-gray-100 dark:bg-white/5"
    >
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-[#3d38f5]/10 to-[#8b87ff]/5">
          {concert.coverImageUrl ? (
            <img
              src={concert.coverImageUrl}
              alt={concert.coverImageAlt || concert.title}
              className="h-full w-full object-cover"
            />
          ) : concert.firstGalleryImage ? (
            <img
              src={concert.firstGalleryImage}
              alt={concert.title}
              className="h-full w-full object-cover"
            />
          ) : concert.artistImage ? (
            <img
              src={concert.artistImage}
              alt={concert.artistBand}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Music className="h-6 w-6 text-[#3d38f5] dark:text-[#8b87ff]" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h4 className="truncate text-sm font-semibold leading-tight text-gray-900 transition-colors group-hover:text-[#8b87ff] sm:text-base dark:text-white">
            {concert.artistBand}
          </h4>
          {concert.subtitle && (
            <p className="truncate text-xs text-gray-600 dark:text-gray-400">
              {concert.subtitle}
            </p>
          )}
          <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-500">
            {new Date(concert.eventDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}
