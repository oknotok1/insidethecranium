"use client";

import { ExternalLink, Music2 } from "lucide-react";
import { useEffect } from "react";
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
        />

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
}: {
  title: string;
  artist: string;
  album: string;
  metadata: {
    duration?: string;
    genres?: string[];
  };
  spotifyUrl?: string;
}) => (
  <>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.artist}>{artist}</p>
    <p className={styles.album}>{album}</p>
    <Metadata {...metadata} />
    <div
      className={styles.spotifyLinkContainer}
      style={{ minHeight: spotifyUrl ? undefined : "2.5rem" }}
    >
      {spotifyUrl && <SpotifyLink url={spotifyUrl} />}
    </div>
  </>
);

const Metadata = ({ genres }: { genres?: string[] }) => (
  <div
    className={styles.metadata}
    style={{ minHeight: genres?.length ? undefined : "1.5rem" }}
  >
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
