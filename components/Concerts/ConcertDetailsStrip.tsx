import { Calendar, MapPin, Music, ListMusic, Ticket } from "lucide-react";

interface ConcertDetailsStripProps {
  artistBand?: string;
  artistSpotifyUrl?: string | null;
  eventDate: string;
  venueName: string;
  venueLocation?: string;
  venueLink?: string;
  setlistFmLink?: string;
  ticketLink?: string;
  genres?: string[];
  className?: string;
}

export function ConcertDetailsStrip({
  artistBand,
  artistSpotifyUrl,
  eventDate,
  venueName,
  venueLocation,
  venueLink,
  setlistFmLink,
  ticketLink,
  genres,
  className = "",
}: ConcertDetailsStripProps) {
  return (
    <div className={className}>
      {/* Main Info Row */}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        {/* Artist */}
        {artistBand && (
          <div className="flex items-center space-x-2">
            <Music className="h-4 w-4" />
            {artistSpotifyUrl ? (
              <a
                href={artistSpotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:underline"
              >
                {artistBand}
              </a>
            ) : (
              <span>{artistBand}</span>
            )}
          </div>
        )}
        <span className="hidden sm:inline">•</span>

        {/* Date */}
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(eventDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <span className="hidden sm:inline">•</span>

        {/* Venue */}
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4" />
          {venueLink ? (
            <a
              href={venueLink}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:underline"
            >
              {venueName}
              {venueLocation && `, ${venueLocation}`}
            </a>
          ) : (
            <span>
              {venueName}
              {venueLocation && `, ${venueLocation}`}
            </span>
          )}
        </div>

        {/* Setlist Link */}
        {setlistFmLink && (
          <>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center space-x-2">
              <ListMusic className="h-4 w-4" />
              <a
                href={setlistFmLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:underline"
              >
                Setlist
              </a>
            </div>
          </>
        )}

        {/* Ticket Link */}
        {ticketLink && (
          <>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center space-x-2">
              <Ticket className="h-4 w-4" />
              <a
                href={ticketLink}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:underline"
              >
                Tickets
              </a>
            </div>
          </>
        )}
      </div>

      {/* Genre Tags */}
      {genres && genres.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {genres.map((genre, idx) => (
            <span
              key={idx}
              className="rounded-full bg-[#3d38f5]/10 px-3 py-1 text-xs font-medium text-[#3d38f5] dark:bg-[#3d38f5]/20 dark:text-[#8b87ff]"
            >
              {genre}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
