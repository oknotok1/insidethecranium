"use client";

import { ExternalLink, Music2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { HeroBackground } from "./Background";
import { HeroSkeleton } from "./HeroSkeleton";

import { useDisplayTrack } from "./hooks/useDisplayTrack";
import { useHeroTimestamp } from "./hooks/useHeroTimestamp";
import { useTrackGenres } from "./hooks/useTrackGenres";

import { extractSongData } from "./utils/songDataExtractor";
import { extractLastPlayedTimestamp } from "./utils/timestampExtractor";

import styles from "./styles.module.scss";

// Utility to format milliseconds to MM:SS
const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function HeroSection() {
  const {
    nowPlayingTrack,
    recentlyPlayedTrack,
    isListening,
    accessToken,
    isLoadingInitialData,
  } = useAppContext();

  const displayTrack = useDisplayTrack(isListening, nowPlayingTrack, recentlyPlayedTrack);

  const genres = useTrackGenres(displayTrack, accessToken);

  const lastPlayedAt = extractLastPlayedTimestamp(
    isListening,
    displayTrack,
    nowPlayingTrack,
    recentlyPlayedTrack,
  );

  const { formattedDate, formattedTime, lastPlayedTimeForLabel } = useHeroTimestamp(
    isListening,
    lastPlayedAt,
  );

  const songData = extractSongData(displayTrack, isListening, nowPlayingTrack);

  if (isLoadingInitialData || !displayTrack) return <HeroSkeleton />;

  return (
    <section id="now-playing" className={styles.heroSection}>
      <HeroBackground />

      <div className={styles.content}>
        <div className={styles.mainContent}>
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
            progressMs={nowPlayingTrack?.progress_ms}
            durationMs={nowPlayingTrack?.item?.duration_ms}
            isListening={isListening}
          />
        </div>

        <Timestamp date={formattedDate} time={formattedTime} isLive={true} />
      </div>
    </section>
  );
}

const AlbumArtwork = ({ artwork, album }: { artwork?: string; album: string }) => {
  if (!artwork)
    return (
      <div className={styles.placeholderIcon}>
        <Music2 className="h-12 w-12" style={{ color: "var(--color-primary)" }} />
      </div>
    );

  return (
    <div className={styles.albumContainer}>
      <div className={styles.albumArtwork}>
        <ImageWithFallback
          src={artwork}
          alt={`${album} album artwork`}
          fill
          priority
          sizes="(max-width: 640px) 192px, 256px"
          className={styles.albumImage}
        />
      </div>
    </div>
  );
};

const SongInfo = ({
  title,
  artist,
  album,
  metadata,
  spotifyUrl,
  progressMs,
  durationMs,
  isListening,
}: {
  title: string;
  artist: string;
  album: string;
  metadata: {
    duration?: string;
    genres?: string[];
  };
  spotifyUrl?: string;
  progressMs?: number;
  durationMs?: number;
  isListening: boolean;
}) => (
  <>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.artist}>{artist}</p>
    <p className={styles.album}>{album}</p>
    <Metadata {...metadata} />
    <ProgressBar
      progressMs={progressMs}
      durationMs={durationMs}
      isListening={isListening}
    />
    <div className={styles.spotifyLinkContainer}>
      {spotifyUrl && <SpotifyLink url={spotifyUrl} />}
    </div>
  </>
);

const Metadata = ({ genres }: { genres?: string[] }) => (
  <div className={styles.metadata}>
    {genres?.map((genre, index) => (
      <span key={genre}>
        {genre}
        {index < genres.length - 1 && <span className={styles.metadataSeparator}>•</span>}
      </span>
    ))}
  </div>
);

const SpotifyLink = ({ url }: { url: string }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className={styles.spotifyLink}>
    <span>Listen on Spotify</span>
    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
  </a>
);

const ProgressBar = ({
  progressMs,
  durationMs,
  isListening,
}: {
  progressMs?: number;
  durationMs?: number;
  isListening: boolean;
}) => {
  const [currentProgress, setCurrentProgress] = useState(progressMs || 0);

  useEffect(() => {
    if (!isListening || !progressMs || !durationMs) {
      return;
    }

    // Set initial progress
    setCurrentProgress(progressMs);

    // Smoothly increment progress every second
    const interval = setInterval(() => {
      setCurrentProgress((prev) => {
        const next = prev + 1000; // Add 1 second
        return next > durationMs ? durationMs : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [progressMs, durationMs, isListening]);

  if (!isListening || !durationMs) return null;

  const progressPercentage = (currentProgress / durationMs) * 100;
  const timeRemaining = durationMs - currentProgress;

  return (
    <div className={styles.progressContainer}>
      <span className={styles.progressTime}>{formatTime(currentProgress)}</span>
      <div className={styles.progressBarWrapper}>
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      <span className={styles.progressTime}>-{formatTime(timeRemaining)}</span>
    </div>
  );
};

const Timestamp = ({
  date,
  time,
  isLive = false,
}: {
  date: string;
  time: string;
  isLive?: boolean;
}) => {
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
