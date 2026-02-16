import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Music } from "lucide-react";

import type { ConcertDetail } from "@/types/contentful";

interface ConcertHeroProps {
  concert: ConcertDetail;
}

export default function ConcertHero({ concert }: ConcertHeroProps) {
  const eventDate = new Date(concert.eventDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
      {/* Cover Image */}
      <div className="relative aspect-21/9 overflow-hidden bg-gray-100 dark:bg-white/5">
        {concert.coverImageUrl ? (
          <>
            <Image
              src={concert.coverImageUrl}
              alt={concert.coverImageAlt || concert.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#3d38f5]/10 to-[#8b87ff]/5">
            <Music className="h-16 w-16 text-[#3d38f5] dark:text-[#8b87ff]" />
          </div>
        )}

        {/* Title Overlay (Mobile) */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:hidden">
          <h1 className="mb-2 text-3xl font-bold">{concert.title}</h1>
          {concert.subtitle && (
            <p className="text-lg opacity-90">{concert.subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8">
        {/* Title (Desktop) */}
        <div className="mb-6 hidden lg:block">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            {concert.title}
          </h1>
          {concert.subtitle && (
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {concert.subtitle}
            </p>
          )}
        </div>

        {/* Event Details Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Artist/Band */}
          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Artist / Band
            </h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {concert.artistBand}
            </p>
          </div>

          {/* Date & Time */}
          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Date & Time
            </h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formattedDate}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formattedTime}
            </p>
          </div>

          {/* Venue */}
          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              Venue
            </h3>
            {concert.venueLink ? (
              <a
                href={concert.venueLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-lg font-semibold text-[#3d38f5] hover:underline dark:text-[#8b87ff]"
              >
                {concert.venueName}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ) : (
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {concert.venueName}
              </p>
            )}
            {concert.venueLocation && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {concert.venueLocation}
              </p>
            )}
          </div>

          {/* Organizer */}
          {concert.organizer && (
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                Organizer
              </h3>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {concert.organizer}
              </p>
            </div>
          )}
        </div>

        {/* Genres */}
        {concert.genres && concert.genres.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {concert.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {(concert.ticketLink || concert.setlistFmLink) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {concert.ticketLink && (
              <a
                href={concert.ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#3d38f5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2e29cc] dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                Get Tickets
              </a>
            )}
            {concert.setlistFmLink && (
              <a
                href={concert.setlistFmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-white/20 dark:bg-black/20 dark:text-gray-300 dark:hover:bg-black/30"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                View Setlist
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
