"use client";

import {
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Music,
  Ticket,
} from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./styles.module.scss";

interface UpcomingShow {
  id: string;
  artistBand?: string;
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
  status?: ShowStatus;
}

type ShowStatus = "confirmed" | "on-fence" | "went";

interface UpcomingShowCardProps {
  show: UpcomingShow;
}

export const UpcomingShowCard = ({ show }: UpcomingShowCardProps) => (
  <div
    className={cn(
      styles.upcomingShowCard,
      "group bg-gray-50 hover:bg-gray-100 dark:bg-white/6 dark:hover:bg-white/11",
    )}
  >
    <CardHeader show={show} />
    <CardBody show={show} />
    <CardFooter show={show} />
  </div>
);

const CardHeader = ({ show }: { show: UpcomingShow }) => {
  const confirmed = isConfirmed(show);

  return (
    <div className={styles.cardHeader}>
      {/* Artist Image/Icon */}
      <div className={styles.artistMedia}>
        <div
          className={cn(
            styles.artistAvatar,
            "bg-gray-200 ring-gray-200 dark:bg-white/10 dark:ring-white/10",
          )}
        >
          {show.artistImage ? (
            <img
              src={show.artistImage}
              alt={show.artistBand}
              className={styles.artistImage}
            />
          ) : (
            <div
              className={cn(
                styles.artistFallback,
                getArtistFallbackToneClasses(confirmed),
              )}
            >
              <Music
                className={cn(
                  styles.artistFallbackIcon,
                  getArtistFallbackIconToneClasses(confirmed),
                )}
              />
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className={styles.statusBadgeWrapper}>
          <div
            className={cn(
              styles.statusBadge,
              "border-gray-50 group-hover:border-gray-100 dark:border-gray-900",
              getStatusBadgeToneClasses(confirmed),
            )}
          >
            {confirmed ? (
              <svg
                className={cn(
                  styles.statusBadgeIcon,
                  getStatusBadgeIconToneClasses(confirmed),
                )}
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
                className={cn(
                  styles.statusBadgeIcon,
                  getStatusBadgeIconToneClasses(confirmed),
                )}
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
      <div className={styles.primaryInfo}>
        {show.artistSpotifyUrl ? (
          <a
            href={show.artistSpotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(styles.artistLink, "text-gray-900 dark:text-white")}
          >
            {show.artistBand}
          </a>
        ) : (
          <h4
            className={cn(styles.artistName, "text-gray-900 dark:text-white")}
          >
            {show.artistBand}
          </h4>
        )}

        {/* Genre Tags */}
        {show.genres && show.genres.length > 0 && (
          <div className={styles.genreList}>
            {show.genres.slice(0, 3).map((genre, idx) => (
              <span
                key={idx}
                className={cn(
                  styles.genreTag,
                  getGenreTagToneClasses(confirmed),
                )}
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        {show.price && (
          <div className={cn(styles.priceRow, "text-gray-900 dark:text-white")}>
            <Ticket
              className={cn(
                styles.priceIcon,
                "text-gray-500 dark:text-gray-400",
              )}
            />
            <span>{show.price}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CardBody = ({ show }: { show: UpcomingShow }) => (
  <div className={styles.cardBody}>
    {/* Date */}
    <div className={styles.detailRow}>
      <Calendar
        className={cn(styles.detailIcon, "text-gray-500 dark:text-gray-400")}
      />
      <div className={styles.detailBody}>
        <span
          className={cn(styles.detailText, "text-gray-900 dark:text-white")}
        >
          {new Date(show.eventDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>

    {/* Venue */}
    <div className={styles.detailRow}>
      <MapPin
        className={cn(styles.detailIcon, "text-gray-500 dark:text-gray-400")}
      />
      <div className={styles.detailBody}>
        {show.venueLink ? (
          <a
            href={show.venueLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(styles.venueLink, "text-gray-900 dark:text-white")}
          >
            {show.venueName}
          </a>
        ) : (
          <div
            className={cn(styles.venueName, "text-gray-900 dark:text-white")}
          >
            {show.venueName}
          </div>
        )}
        {show.venueLocation && (
          <span
            className={cn(
              styles.venueLocation,
              "text-gray-600 dark:text-gray-400",
            )}
          >
            {show.venueLocation}
          </span>
        )}
      </div>
    </div>

    {/* Organizer */}
    {show.organizer && (
      <div className={`${styles.detailRow} ${styles.organizerRow}`}>
        <Music
          className={cn(styles.detailIcon, "text-gray-500 dark:text-gray-400")}
        />
        <div className={styles.detailBody}>
          <div
            className={cn(
              styles.organizerLabel,
              "text-gray-600 dark:text-gray-400",
            )}
          >
            Presented by
          </div>
          {show.organizerUrl ? (
            <a
              href={show.organizerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                styles.organizerLink,
                getOrganizerToneClasses(isConfirmed(show)),
              )}
            >
              {show.organizer}
            </a>
          ) : (
            <div
              className={cn(
                styles.organizerName,
                "text-gray-700 dark:text-gray-300",
              )}
            >
              {show.organizer}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);

const CardFooter = ({ show }: { show: UpcomingShow }) => {
  const confirmed = isConfirmed(show);

  return (
    <div
      className={cn(
        styles.cardFooter,
        "border-gray-200 group-hover:border-gray-300 dark:border-white/10 dark:group-hover:border-white/15",
      )}
    >
      {show.ticketLink ? (
        <a
          href={show.ticketLink}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            styles.actionButton,
            getTicketActionToneClasses(confirmed),
          )}
        >
          <Ticket className={styles.actionIcon} />
          <span className={styles.actionLabel}>
            {confirmed ? "Get Tickets" : "View Tickets"}
          </span>
        </a>
      ) : show.organizerUrl ? (
        <a
          href={show.organizerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(styles.actionButton, getSecondaryActionToneClasses())}
        >
          <ExternalLink className={styles.actionIcon} />
          <span className={styles.actionLabel}>Event Info</span>
        </a>
      ) : (
        <div
          className={cn(styles.actionButton, getDisabledActionToneClasses())}
        >
          <Clock className={styles.actionIcon} />
          <span className={styles.actionLabel}>Tickets Coming Soon</span>
        </div>
      )}
    </div>
  );
};

const isConfirmed = (show: UpcomingShow) => show.status === "confirmed";

function getArtistFallbackToneClasses(confirmed: boolean) {
  if (confirmed) {
    return "bg-linear-to-br from-[#3d38f5]/10 to-[#8b87ff]/10";
  }

  return "bg-linear-to-br from-yellow-500/10 to-yellow-400/10";
}

function getArtistFallbackIconToneClasses(confirmed: boolean) {
  if (confirmed) {
    return "text-[#3d38f5] dark:text-[#8b87ff]";
  }

  return "text-yellow-600 dark:text-yellow-500";
}

function getStatusBadgeToneClasses(confirmed: boolean) {
  if (confirmed) {
    return "bg-green-500";
  }

  return "bg-yellow-500";
}

function getStatusBadgeIconToneClasses(confirmed: boolean) {
  if (confirmed) {
    return "text-white";
  }

  return "text-gray-900";
}

function getGenreTagToneClasses(confirmed: boolean) {
  if (confirmed) {
    return "bg-[#3d38f5]/10 text-[#3d38f5] dark:bg-[#3d38f5]/20 dark:text-[#8b87ff]";
  }

  return "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400";
}

function getOrganizerToneClasses(confirmed: boolean) {
  if (confirmed) {
    return "text-[#3d38f5] dark:text-[#8b87ff]";
  }

  return "text-yellow-700 dark:text-yellow-400";
}

function getTicketActionToneClasses(confirmed: boolean) {
  if (confirmed) {
    return "bg-linear-to-r from-[#3d38f5] to-[#8b87ff] text-white group-hover:from-[#2d28e5] group-hover:to-[#7b77ef] hover:bg-[#3d38f5]!";
  }

  return getSecondaryActionToneClasses();
}

function getSecondaryActionToneClasses() {
  return "bg-gray-100 text-gray-900 group-hover:bg-gray-200 hover:bg-[#3d38f5]! hover:text-white! dark:bg-white/10 dark:text-white dark:group-hover:bg-white/15 dark:hover:bg-[#3d38f5]!";
}

function getDisabledActionToneClasses() {
  return "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400";
}
