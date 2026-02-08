"use client";

import { ExternalLink, Music2 } from "lucide-react";
import React, { useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { ImageWithFallback } from "@/figma/ImageWithFallback";
import { HeroBackground } from "./Background";
import { useTrackGenres } from "./hooks/useTrackGenres";
import { useHeroTimestamp } from "./hooks/useHeroTimestamp";
import { useDisplayTrack } from "./hooks/useDisplayTrack";
import { extractSongData } from "./utils/songDataExtractor";
import styles from "./styles.module.scss";

interface SongMetadata {
  genres?: string[];
  album?: string;
  duration?: string;
}

interface TimestampProps {
  date: string;
  time: string;
  isLive?: boolean;
}

export default function HeroSection() {
  const { nowPlayingTrack, recentlyPlayedTrack, isListening, accessToken } =
    useAppContext();

  // Get the track to display (current or last played)
  const displayTrack = useDisplayTrack(
    isListening,
    nowPlayingTrack,
    recentlyPlayedTrack,
  );

  // Fetch genres for the current track
  const genres = useTrackGenres(displayTrack, accessToken);

  // Get formatted timestamps
  // Determine which timestamp to use based on which track we're showing
  let lastPlayedAt: string | undefined;

  if (!isListening) {
    if (displayTrack?.id === recentlyPlayedTrack?.items?.[0]?.track?.id) {
      // Showing recently played track - use its timestamp
      lastPlayedAt = recentlyPlayedTrack?.items?.[0]?.played_at;
    } else if (
      displayTrack?.id === nowPlayingTrack?.item?.id &&
      (nowPlayingTrack as any)?.timestamp
    ) {
      // Showing now playing track (just stopped) - use its timestamp as approximation
      lastPlayedAt = new Date((nowPlayingTrack as any).timestamp).toISOString();
    }
  }

  const { formattedDate, formattedTime, lastPlayedTimeForLabel } =
    useHeroTimestamp(isListening, lastPlayedAt);

  // Extract song data for display
  const songData = extractSongData(displayTrack, isListening, nowPlayingTrack);

  return (
    <section id="now-playing" className={styles.heroSection}>
      <HeroBackground />

      <div className={styles.content}>
        <div className={styles.listeningLabel}>
          {isListening
            ? "I'm currently listening to"
            : lastPlayedTimeForLabel || "Last played"}
        </div>

        <AlbumArtwork artwork={songData.albumArtwork} album={songData.album} />

        <SongInfo
          title={songData.title}
          artist={songData.artist}
          album={songData.album}
          metadata={{
            genres: genres.length > 0 ? genres : undefined,
            duration: songData.duration,
          }}
          spotifyUrl={songData.spotifyUrl}
          isListening={isListening}
          progress={songData.progress}
          lastPlayedTime={lastPlayedTimeForLabel}
        />

        <Timestamp date={formattedDate} time={formattedTime} isLive={true} />
      </div>
    </section>
  );
}

const AlbumArtwork = ({
  artwork,
  album,
}: {
  artwork?: string;
  album: string;
}) => {
  if (artwork) {
    return (
      <div className={styles.albumContainer}>
        <div className={styles.albumArtwork}>
          <ImageWithFallback
            src={artwork}
            alt={`${album} album artwork`}
            className={styles.albumImage}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.placeholderIcon}>
      <Music2 className="w-12 h-12" style={{ color: "var(--color-primary)" }} />
    </div>
  );
};

const SongInfo = ({
  title,
  artist,
  album,
  metadata,
  spotifyUrl,
  isListening,
  progress,
  lastPlayedTime,
}: {
  title: string;
  artist: string;
  album: string;
  metadata: SongMetadata;
  spotifyUrl?: string;
  isListening: boolean;
  progress?: string;
  lastPlayedTime?: string;
}) => (
  <>
    <h1 className={styles.title}>{title}</h1>

    <p className={styles.artist}>{artist}</p>

    <p className={styles.album}>{album}</p>

    <Metadata {...metadata} progress={progress} />

    {spotifyUrl && <SpotifyLink url={spotifyUrl} />}
  </>
);

const Metadata = ({
  genres,
  duration,
}: SongMetadata & { progress?: string }) => {
  if (!genres || genres.length === 0) return null;

  return (
    <div className={styles.metadata}>
      {genres.map((genre, index) => (
        <React.Fragment key={index}>
          <span key={genre}>{genre}</span>
          {index < genres.length - 1 && (
            <span key={`sep-${index}`} className={styles.metadataSeparator}>
              •
            </span>
          )}
        </React.Fragment>
      ))}
      {/* {duration && (
        <>
          <span className={styles.metadataSeparator}>•</span>
          <span>{duration}</span>
        </>
      )} */}
    </div>
  );
};

const SpotifyLink = ({ url }: { url: string }) => (
  <div className={styles.spotifyLinkContainer}>
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.spotifyLink}
    >
      <span>Listen on Spotify</span>
      <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </a>
  </div>
);

const Timestamp = ({ date, time, isLive = false }: TimestampProps) => {
  useEffect(() => {
    if (!isLive) {
      // Ensure colon is visible when not live
      const colon = document.getElementById("hero-timestamp-colon");
      if (colon) {
        colon.style.visibility = "visible";
      }
      return undefined;
    }

    const interval = setInterval(() => {
      const colon = document.getElementById("hero-timestamp-colon");
      if (colon) {
        colon.style.visibility =
          colon.style.visibility === "hidden" ? "visible" : "hidden";
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Split the time to wrap the colon in a span
  const timeParts = time.split(":");

  return (
    <div className={styles.timestampContainer}>
      <div className={styles.timestamp}>
        {date} • {timeParts[0]}
        <span id="hero-timestamp-colon">:</span>
        {timeParts[1]}
      </div>
    </div>
  );
};
