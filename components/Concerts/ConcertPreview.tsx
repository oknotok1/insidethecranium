import { ArrowRight } from "lucide-react";

import ReactMarkdown from "react-markdown";

import Link from "next/link";

import type { ConcertDetail } from "@/types/contentful";

import { ConcertDetailsStrip } from "./ConcertDetailsStrip";
import { ConcertMediaGrid } from "./ConcertMediaGrid";

interface ConcertPreviewProps {
  concert: ConcertDetail & {
    artistSpotifyUrl?: string | null;
  };
}

export function ConcertPreview({ concert }: ConcertPreviewProps) {
  return (
    <article id={concert.slug} className="space-y-6">
      {/* Concert Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl text-gray-900 sm:text-3xl dark:text-white">
            {concert.title}
          </h2>

          {concert.subtitle && (
            <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
              {concert.subtitle}
            </p>
          )}

          <ConcertDetailsStrip
            artistBand={concert.artistBand}
            artistSpotifyUrl={concert.artistSpotifyUrl}
            eventDate={concert.eventDate}
            venueName={concert.venueName}
            venueLocation={concert.venueLocation}
            venueLink={concert.venueLink}
            setlistFmLink={concert.setlistFmLink}
            ticketLink={concert.ticketLink}
            genres={concert.genres}
          />
        </div>

        {/* Desktop: View link on the right */}
        <div className="hidden sm:block">
          <Link
            href={`/concerts/${concert.slug}`}
            className="flex w-fit items-center space-x-2 text-sm text-nowrap text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <span>View Full Gallery & Details</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Reflection/Write-up */}
      {concert.reflection && (
        <div className="line-clamp-4 text-sm leading-relaxed font-light text-gray-600 sm:text-base dark:text-gray-400">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-4">{children}</p>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3d38f5] transition-all hover:underline dark:text-[#8b87ff]"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
            }}
          >
            {concert.reflection}
          </ReactMarkdown>
        </div>
      )}

      {/* Mobile: View link below genre chips */}
      <div className="sm:hidden">
        <Link
          href={`/concerts/${concert.slug}`}
          className="flex w-fit items-center space-x-2 text-sm text-nowrap text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <span>View Full Gallery & Details</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <ConcertMediaGrid
        concertSlug={concert.slug}
        concertTitle={concert.title}
        galleryImages={concert.galleryImages}
        videos={concert.videos}
        maxItems={6}
      />
    </article>
  );
}
