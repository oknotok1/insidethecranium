"use client";

import { useAppContext } from "@/contexts/AppContext";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [currentPosition, setCurrentPosition] = useState(0);

  // Update position every second when playing
  useEffect(() => {
    if (isListening && nowPlayingTrack?.progress_ms !== undefined) {
      setCurrentPosition(nowPlayingTrack.progress_ms);

      const interval = setInterval(() => {
        setCurrentPosition((prev) => {
          const newPosition = prev + 1000;
          const duration = nowPlayingTrack?.item?.duration_ms || 0;
          return newPosition < duration ? newPosition : duration;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else if (nowPlayingTrack?.progress_ms !== undefined) {
      setCurrentPosition(nowPlayingTrack.progress_ms);
    }
  }, [
    isListening,
    nowPlayingTrack?.progress_ms,
    nowPlayingTrack?.item?.duration_ms,
  ]);

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
