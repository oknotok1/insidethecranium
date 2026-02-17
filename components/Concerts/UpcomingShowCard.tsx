"use client";

import { Calendar, MapPin, Music, ExternalLink, Clock, Ticket } from "lucide-react";

interface UpcomingShow {
  id: string;
  artistBand: string;
  artistImage: string | null;
  artistSpotifyUrl?: string | null;
  genres?: string[];
  price?: string;
  eventDate: string;
  venueName: string;
  venueLocation?: string;
  venueLink?: string;
  organizer?: string;
  organizerUrl?: string;
  ticketLink?: string;
  status?: "confirmed" | "on-fence" | "went";
}

interface UpcomingShowCardProps {
  show: UpcomingShow;
}

export function UpcomingShowCard({ show }: UpcomingShowCardProps) {
  const isConfirmed = show.status === "confirmed";

  return (
    <div
      className="group rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 dark:bg-white/6 dark:hover:bg-white/11"
    >
      <div className="mb-4 flex gap-4">
        {/* Artist Image/Icon */}
        <div className="relative shrink-0">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200 ring-2 ring-gray-200 dark:bg-white/10 dark:ring-white/10">
            {show.artistImage ? (
              <img
                src={show.artistImage}
                alt={show.artistBand}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center ${
                isConfirmed 
                  ? 'bg-linear-to-br from-[#3d38f5]/10 to-[#8b87ff]/10'
                  : 'bg-linear-to-br from-yellow-500/10 to-yellow-400/10'
              }`}>
                <Music className={`h-8 w-8 ${
                  isConfirmed
                    ? 'text-[#3d38f5] dark:text-[#8b87ff]'
                    : 'text-yellow-600 dark:text-yellow-500'
                }`} />
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="absolute -bottom-1 -right-1">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-gray-50 shadow-lg transition-colors group-hover:border-gray-100 dark:border-gray-900 ${
              isConfirmed ? 'bg-green-500' : 'bg-yellow-500'
            }`}>
              {isConfirmed ? (
                <svg
                  className="h-3.5 w-3.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-3.5 w-3.5 text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Primary Info */}
        <div className="min-w-0 flex-1">
          {show.artistSpotifyUrl ? (
            <a
              href={show.artistSpotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 block truncate text-lg font-semibold text-gray-900 hover:underline dark:text-white"
            >
              {show.artistBand}
            </a>
          ) : (
            <h4 className="mb-1 truncate text-lg font-semibold text-gray-900 dark:text-white">
              {show.artistBand}
            </h4>
          )}

          {/* Genre Tags */}
          {show.genres && show.genres.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {show.genres.slice(0, 3).map((genre, idx) => (
                <span
                  key={idx}
                  className={`rounded px-2 py-0.5 text-xs font-medium ${
                    isConfirmed
                      ? 'bg-[#3d38f5]/10 text-[#3d38f5] dark:bg-[#3d38f5]/20 dark:text-[#8b87ff]'
                      : 'bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400'
                  }`}
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          {show.price && (
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
              <Ticket className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              <span>{show.price}</span>
            </div>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="mb-4 space-y-2.5">
        {/* Date */}
        <div className="flex items-start gap-2.5">
          <Calendar className={`mt-0.5 h-4 w-4 shrink-0 ${
            isConfirmed
              ? 'text-[#3d38f5] dark:text-[#8b87ff]'
              : 'text-yellow-600 dark:text-yellow-500'
          }`} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(show.eventDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Venue */}
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
          <div className="min-w-0 flex-1">
            {show.venueLink ? (
              <a
                href={show.venueLink}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-sm font-medium text-gray-900 hover:underline dark:text-white"
              >
                {show.venueName}
              </a>
            ) : (
              <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                {show.venueName}
              </div>
            )}
            {show.venueLocation && (
              <div className="truncate text-xs text-gray-600 dark:text-gray-400">
                {show.venueLocation}
              </div>
            )}
          </div>
        </div>

        {/* Organizer */}
        {show.organizer && (
          <div className="flex items-start gap-2.5">
            <Music className="mt-0.5 h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" />
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Presented by
              </div>
              {show.organizerUrl ? (
                <a
                  href={show.organizerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline text-sm font-medium hover:underline ${
                    isConfirmed
                      ? 'text-[#3d38f5] dark:text-[#8b87ff]'
                      : 'text-yellow-700 dark:text-yellow-400'
                  }`}
                >
                  {show.organizer}
                </a>
              ) : (
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {show.organizer}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Label */}
      <div className="border-t border-gray-200 pt-3 transition-colors group-hover:border-gray-300 dark:border-white/10 dark:group-hover:border-white/15">
        {show.ticketLink ? (
          <a
            href={show.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isConfirmed
                ? 'bg-linear-to-r from-[#3d38f5] to-[#8b87ff] text-white group-hover:from-[#2d28e5] group-hover:to-[#7b77ef] hover:bg-[#3d38f5]!'
                : 'bg-gray-100 text-gray-900 group-hover:bg-gray-200 hover:bg-[#3d38f5]! hover:text-white! dark:bg-white/10 dark:text-white dark:group-hover:bg-white/15 dark:hover:bg-[#3d38f5]!'
            }`}
          >
            <Ticket className="h-4 w-4 shrink-0" />
            <span className="leading-none">{isConfirmed ? 'Get Tickets' : 'View Tickets'}</span>
          </a>
        ) : show.organizerUrl ? (
          <a
            href={show.organizerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-900 transition-colors group-hover:bg-gray-200 hover:bg-[#3d38f5]! hover:text-white! dark:bg-white/10 dark:text-white dark:group-hover:bg-white/15 dark:hover:bg-[#3d38f5]!"
          >
            <ExternalLink className="h-4 w-4 shrink-0" />
            <span className="leading-none">Event Info</span>
          </a>
        ) : (
          <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-500 dark:bg-white/10 dark:text-gray-400">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="leading-none">Tickets Coming Soon</span>
          </div>
        )}
      </div>
    </div>
  );
}
