"use client";

import { useEffect, useRef, useState } from "react";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

import { useAppContext } from "@/contexts/AppContext";

import styles from "./styles.module.scss";

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function WebPlayerControls() {
  const {
    webPlayer,
    isListening,
    enableWebPlayer,
    setEnableWebPlayer,
    nowPlayingTrack,
  } = useAppContext();

  // Track the current track ID to detect track changes
  const currentTrackId = nowPlayingTrack?.item?.id;
  const previousTrackIdRef = useRef<string | undefined>(currentTrackId);

  // Initialize with current progress, or 0 if not available
  const [currentPosition, setCurrentPosition] = useState(
    () => nowPlayingTrack?.progress_ms ?? 0,
  );

  // Reset position when track changes or when progress_ms changes significantly (seek event)
  // This synchronizes local UI state with external Spotify API state
  useEffect(() => {
    const progressMs = nowPlayingTrack?.progress_ms;
    const hasTrackChanged = currentTrackId !== previousTrackIdRef.current;
    const hasSignificantSeek =
      progressMs !== undefined && Math.abs(progressMs - currentPosition) > 2000; // More than 2 seconds difference

    if (hasTrackChanged || hasSignificantSeek) {
      // Intentionally syncing external Spotify state to local state for UI
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentPosition(progressMs ?? 0);
      previousTrackIdRef.current = currentTrackId;
    }
  }, [currentTrackId, nowPlayingTrack?.progress_ms, currentPosition]);

  // Update position every second when playing
  useEffect(() => {
    if (!isListening) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentPosition((prev) => {
        const newPosition = prev + 1000;
        const duration = nowPlayingTrack?.item?.duration_ms || 0;
        return newPosition < duration ? newPosition : duration;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isListening, nowPlayingTrack?.item?.duration_ms]);

  return (
    <div className={styles.container}>
      {!enableWebPlayer && (
        <div className={styles.playerStatus}>
          <p className={styles.statusText}>Want to control playback?</p>
          <button
            onClick={() => setEnableWebPlayer(true)}
            className={styles.enableButton}
          >
            Enable Web Player
          </button>
        </div>
      )}

      {enableWebPlayer && !webPlayer && (
        <div className={styles.playerStatus}>
          <p className={styles.statusText}>Loading web player...</p>
        </div>
      )}

      {enableWebPlayer && webPlayer && !webPlayer.isReady && (
        <div className={styles.playerStatus}>
          <p className={styles.statusText}>Connecting to Spotify...</p>
        </div>
      )}

      {enableWebPlayer && webPlayer?.isReady && (
        <div className={styles.controls}>
          <div className={styles.playbackInfo}>
            {nowPlayingTrack?.item && (
              <>
                <div className={styles.trackInfo}>
                  <span className={styles.trackName}>
                    {nowPlayingTrack.item.name}
                  </span>
                  <span className={styles.trackArtist}>
                    {nowPlayingTrack.item.artists[0]?.name}
                  </span>
                </div>
                <div className={styles.progressSection}>
                  <span
                    className={`${styles.time} ${!isListening ? styles.paused : ""}`}
                  >
                    {formatTime(currentPosition)}
                  </span>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${!isListening ? styles.paused : ""}`}
                      style={{
                        width: `${(currentPosition / (nowPlayingTrack.item.duration_ms || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    className={`${styles.time} ${!isListening ? styles.paused : ""}`}
                  >
                    {formatTime(nowPlayingTrack.item.duration_ms)}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className={styles.controlButtons}>
            <button
              onClick={webPlayer.skipToPrevious}
              className={styles.controlButton}
              aria-label="Previous track"
            >
              <SkipBack />
            </button>

            <button
              onClick={webPlayer.togglePlay}
              className={`${styles.controlButton} ${styles.playButton}`}
              aria-label={isListening ? "Pause" : "Play"}
            >
              {isListening ? <Pause /> : <Play />}
            </button>

            <button
              onClick={webPlayer.skipToNext}
              className={styles.controlButton}
              aria-label="Next track"
            >
              <SkipForward />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
