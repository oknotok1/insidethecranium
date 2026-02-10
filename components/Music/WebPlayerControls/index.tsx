"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

import { useEffect, useState } from "react";

import { useAppContext, type NowPlayingTrack } from "@/contexts/AppContext";

import styles from "./styles.module.scss";

type TrackItem = NonNullable<NowPlayingTrack["item"]>;

const PROGRESS_UPDATE_INTERVAL = 1000;
const ICON_SIZE_SMALL = 16;
const ICON_SIZE_LARGE = 20;

// Helper to format milliseconds to MM:SS
const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Helper to calculate progress percentage
const calculateProgress = (current: number, total: number): number => {
  return (current / (total || 1)) * 100;
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

  useEffect(() => {
    if (isListening && nowPlayingTrack?.progress_ms !== undefined) {
      setCurrentPosition(nowPlayingTrack.progress_ms);

      const interval = setInterval(() => {
        setCurrentPosition((prev) => {
          const newPosition = prev + PROGRESS_UPDATE_INTERVAL;
          const duration = nowPlayingTrack?.item?.duration_ms || 0;
          return newPosition < duration ? newPosition : duration;
        });
      }, PROGRESS_UPDATE_INTERVAL);

      return () => clearInterval(interval);
    } else if (nowPlayingTrack?.progress_ms !== undefined) {
      setCurrentPosition(nowPlayingTrack.progress_ms);
    }
  }, [
    isListening,
    nowPlayingTrack?.progress_ms,
    nowPlayingTrack?.item?.duration_ms,
  ]);

  if (!enableWebPlayer) {
    return (
      <div className={styles.container}>
        <StatusMessage
          text="Want to control playback?"
          action={{
            label: "Enable Web Player",
            onClick: () => setEnableWebPlayer(true),
          }}
        />
      </div>
    );
  }

  if (!webPlayer) {
    return (
      <div className={styles.container}>
        <StatusMessage text="Loading web player..." />
      </div>
    );
  }

  if (!webPlayer.isReady) {
    return (
      <div className={styles.container}>
        <StatusMessage text="Connecting to Spotify..." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.controls} gap-2 rounded-xl border border-gray-200/50 bg-white/95 p-4 shadow-2xl backdrop-blur-sm md:gap-3 md:p-5 dark:border-white/10 dark:bg-black/95`}
      >
        {nowPlayingTrack?.item && (
          <PlaybackInfo
            track={nowPlayingTrack.item}
            currentPosition={currentPosition}
            isListening={isListening}
          />
        )}

        <ControlButtons webPlayer={webPlayer} isListening={isListening} />
      </div>
    </div>
  );
}

// Status message component
const StatusMessage = ({
  text,
  action,
}: {
  text: string;
  action?: { label: string; onClick: () => void };
}) => (
  <div className="min-w-[250px] rounded-xl border border-gray-200/50 bg-white/95 p-4 text-center shadow-2xl backdrop-blur-sm md:p-5 dark:border-white/10 dark:bg-black/95">
    <p className="m-0 text-sm text-gray-600 dark:text-gray-400">{text}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-3 cursor-pointer rounded-full bg-gradient-to-r from-[#3d38f5] to-[#8b87ff] px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
      >
        {action.label}
      </button>
    )}
  </div>
);

// Playback info component
const PlaybackInfo = ({
  track,
  currentPosition,
  isListening,
}: {
  track: TrackItem;
  currentPosition: number;
  isListening: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex flex-col gap-0.5">
      <span className="max-w-[250px] overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap text-gray-900 dark:text-white">
        {track.name}
      </span>
      <span className="max-w-[250px] overflow-hidden text-[0.7rem] text-ellipsis whitespace-nowrap text-gray-600 dark:text-gray-400">
        {track.artists[0]?.name}
      </span>
    </div>
    <ProgressBar
      current={currentPosition}
      duration={track.duration_ms}
      isPlaying={isListening}
    />
  </div>
);

// Progress bar component
const ProgressBar = ({
  current,
  duration,
  isPlaying,
}: {
  current: number;
  duration: number;
  isPlaying: boolean;
}) => (
  <div className="flex items-center gap-1.5">
    <span
      className={`min-w-[35px] text-center text-[0.65rem] text-gray-600 tabular-nums transition-opacity dark:text-gray-400 ${!isPlaying ? "opacity-50" : ""}`}
    >
      {formatTime(current)}
    </span>
    <div className="h-[3px] flex-1 overflow-hidden rounded-sm bg-gray-300 dark:bg-white/20">
      <div
        className={`h-full bg-gradient-to-r from-[#3d38f5] to-[#8b87ff] transition-all ${!isPlaying ? "opacity-30" : ""}`}
        style={{ width: `${calculateProgress(current, duration)}%` }}
      />
    </div>
    <span
      className={`min-w-[35px] text-center text-[0.65rem] text-gray-600 tabular-nums transition-opacity dark:text-gray-400 ${!isPlaying ? "opacity-50" : ""}`}
    >
      {formatTime(duration)}
    </span>
  </div>
);

// Control buttons component
const ControlButtons = ({
  webPlayer,
  isListening,
}: {
  webPlayer: {
    skipToPrevious: () => void;
    togglePlay: () => void;
    skipToNext: () => void;
  };
  isListening: boolean;
}) => (
  <div className="flex items-center justify-center gap-3 pt-1 md:gap-4">
    <button
      onClick={webPlayer.skipToPrevious}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-900 transition-all hover:scale-105 hover:bg-gray-300 active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
      aria-label="Previous track"
    >
      <SkipBack size={ICON_SIZE_SMALL} />
    </button>

    <button
      onClick={webPlayer.togglePlay}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#3d38f5] to-[#8b87ff] text-white transition-all hover:scale-105 hover:shadow-lg active:scale-95"
      aria-label={isListening ? "Pause" : "Play"}
    >
      {isListening ? (
        <Pause size={ICON_SIZE_LARGE} />
      ) : (
        <Play size={ICON_SIZE_LARGE} />
      )}
    </button>

    <button
      onClick={webPlayer.skipToNext}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-900 transition-all hover:scale-105 hover:bg-gray-300 active:scale-95 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
      aria-label="Next track"
    >
      <SkipForward size={ICON_SIZE_SMALL} />
    </button>
  </div>
);
