"use client";

import { Play, Pause } from "lucide-react";

import { useState, useEffect, useRef } from "react";

import Image from "next/image";

import { useAppContext, type NowPlayingTrack } from "@/contexts/AppContext";
import { usePreviewPlayer } from "@/contexts/PreviewPlayerContext";
import { useYouTubeSearch } from "@/hooks/useYouTubeSearch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import styles from "./styles.module.scss";

type TrackItem = NonNullable<NowPlayingTrack["item"]>;

const BUTTON_GRADIENT = "bg-linear-to-r from-[#3d38f5] to-[#8b87ff]";
const RADIAL_GRADIENT_STYLE = {
  background:
    "radial-gradient(circle at 30% 50%, rgba(61, 56, 245, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(139, 135, 255, 0.12) 0%, transparent 50%)",
};

interface NowPlayingProps {
  className?: string;
}

// Helper component for track info text
const TrackText = ({
  text,
  className,
}: {
  text: string;
  className: string;
}) => <span className={className}>{text}</span>;

// Helper component for separator
const Separator = () => (
  <span className="mx-1.5 font-normal opacity-70">•</span>
);

export default function NowPlaying({ className }: NowPlayingProps) {
  const { nowPlayingTrack, nowPlayingGenres, isListening } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update progress bar smoothly in real-time
  useEffect(() => {
    if (!nowPlayingTrack?.item || !nowPlayingTrack.progress_ms || !nowPlayingTrack.item.duration_ms || !nowPlayingTrack.is_playing) {
      // If not playing or no progress data, use the static progress
      const staticProgress = nowPlayingTrack?.progress_ms && nowPlayingTrack?.item?.duration_ms
        ? (nowPlayingTrack.progress_ms / nowPlayingTrack.item.duration_ms) * 100
        : 0;
      setCurrentProgress(staticProgress);
      startTimeRef.current = null;
      return;
    }

    // Set the start time when we receive new progress data
    startTimeRef.current = Date.now();
    const initialProgress = nowPlayingTrack.progress_ms;

    const interval = setInterval(() => {
      if (startTimeRef.current && nowPlayingTrack.item) {
        const elapsed = Date.now() - startTimeRef.current;
        const estimatedProgress = initialProgress + elapsed;
        const progressPercent = Math.min(
          (estimatedProgress / nowPlayingTrack.item.duration_ms) * 100,
          100
        );
        setCurrentProgress(progressPercent);
      }
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [nowPlayingTrack?.progress_ms, nowPlayingTrack?.is_playing, nowPlayingTrack?.item?.duration_ms, nowPlayingTrack?.item]);

  if (!nowPlayingTrack || !isListening || !nowPlayingTrack.item) return null;

  const track = nowPlayingTrack.item;
  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const progress = currentProgress;

  return (
    <div className={`${styles.nowPlaying} ${className || ""} relative min-w-0`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <div 
          className="relative min-w-0 rounded-full transition-transform duration-200 dark:p-[1.75px] dark:hover:scale-[1.02] dark:active:scale-100"
        >
          {/* Progress outline - only visible in dark mode */}
          <div 
            className="pointer-events-none absolute inset-0 hidden rounded-full dark:block"
            style={{
              background: `linear-gradient(90deg, rgba(55, 65, 81, 0.85) 0%, rgba(55, 65, 81, 0.85) ${progress}%, rgba(107, 114, 128, 0.5) ${progress}%, rgba(107, 114, 128, 0.5) 100%)`,
              boxShadow: '0 0 5px rgba(55, 65, 81, 0.4), inset 0 0 1.5px rgba(0, 0, 0, 0.15)'
            }}
          />
          <PopoverTrigger asChild>
            <button
              className={`relative flex w-full min-w-0 cursor-pointer items-center space-x-2 overflow-hidden rounded-full ${BUTTON_GRADIENT} px-3 py-1.5 text-xs text-white transition-all hover:scale-[1.02] hover:shadow-lg active:scale-100 dark:hover:scale-100`}
              aria-label={`Now playing: ${track.name} by ${track.artists[0]?.name} from ${track.album?.name}`}
            >
              <Play className="h-3 w-3 shrink-0 fill-current" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="animate-marquee inline-block whitespace-nowrap">
                  <TrackInfo track={track} />
                  <TrackInfo track={track} />
                </div>
              </div>
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent 
          className="w-64 overflow-hidden rounded-xl border border-gray-200 bg-white p-0 shadow-2xl dark:border-white/10 dark:bg-gray-900"
          align={isMobile ? "end" : "center"}
          side="bottom"
          sideOffset={8}
          alignOffset={0}
          avoidCollisions={true}
        >
          <PopoverContentInner
            track={track}
            genres={nowPlayingGenres}
            progress={progress}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Component for displaying track info in marquee
const TrackInfo = ({ track }: { track: TrackItem }) => (
  <div className="inline-block">
    <TrackText text={track.name} className="font-semibold" />
    <Separator />
    <TrackText text={track.artists[0]?.name} className="font-normal" />
    <Separator />
    <TrackText text={track.album?.name} className="font-light italic" />
    <span className="mx-4" />
  </div>
);

// Helper function to format time in mm:ss
const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Popover content component for expanded track details
const PopoverContentInner = ({
  track,
  genres,
  progress,
}: {
  track: TrackItem;
  genres: string[];
  progress: number;
}) => {
  const currentTimeMs = (progress / 100) * track.duration_ms;
  const currentTime = formatTime(currentTimeMs);
  const remainingTimeMs = track.duration_ms - currentTimeMs;
  const timeRemaining = `-${formatTime(remainingTimeMs)}`;

  // Mini player integration
  const { currentTrack, isPlaying, togglePlayPause } = usePreviewPlayer();
  const { searchVideo } = useYouTubeSearch();
  const isCurrentTrack = currentTrack?.id === track.id;
  const isPlayingThis = isCurrentTrack && isPlaying;

  const handlePlayClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isCurrentTrack && currentTrack) {
      // Pass the existing currentTrack which has the youtubeVideoId
      togglePlayPause(currentTrack);
    } else {
      const youtubeVideoId = await searchVideo(track.name, track.artists[0]?.name || '');
      
      togglePlayPause({
        id: track.id,
        name: track.name,
        artists: track.artists,
        album: track.album,
        youtubeVideoId,
        spotifyUrl: track.external_urls?.spotify || `https://open.spotify.com/track/${track.id}`,
      });
    }
  };

  return (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
        <div className="absolute inset-0" style={RADIAL_GRADIENT_STYLE} />
      </div>

      {/* Content */}
      <div className="relative p-5">
        <div className="mb-3 text-center text-xs text-gray-600 dark:text-gray-400">
          Now Playing
        </div>

        {track.album?.images[0]?.url && (
          <div className="group mb-3 flex justify-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-300/50 bg-gray-200 shadow-xl dark:border-white/10 dark:bg-white/5">
              <Image
                src={track.album.images[0].url}
                alt={track.album.name}
                fill
                sizes="128px"
                className="object-cover"
              />
              
              {/* Play Button Overlay - Always visible on mobile, hover on desktop */}
              <div
                onClick={handlePlayClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePlayClick(e as any);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`absolute inset-0 flex cursor-pointer items-center justify-center transition-all duration-200 hover:bg-black/40 ${
                  isCurrentTrack
                    ? "bg-black/40 opacity-100"
                    : "bg-black/20 opacity-100 max-lg:opacity-100 lg:opacity-0 group-hover:bg-black/40 lg:group-hover:opacity-100"
                }`}
                aria-label={isPlayingThis ? "Pause" : "Play preview"}
              >
                <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 dark:bg-black/90">
                  {isPlayingThis ? (
                    <Pause className="h-6 w-6 fill-current text-gray-900 dark:text-white" />
                  ) : (
                    <Play className="h-6 w-6 fill-current text-gray-900 dark:text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-3 text-center">
          {/* Song Name */}
          <a
            href={track.external_urls?.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-1 block cursor-pointer text-base font-medium text-gray-900 transition-colors hover:text-[#3d38f5] hover:underline dark:text-white dark:hover:text-[#8b87ff]"
          >
            {track.name}
          </a>
          
          {/* Artist Name */}
          {track.artists[0]?.external_urls?.spotify ? (
            <a
              href={track.artists[0].external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-1 block cursor-pointer text-xs text-gray-700 transition-colors hover:text-[#3d38f5] hover:underline dark:text-gray-300 dark:hover:text-[#8b87ff]"
            >
              {track.artists[0]?.name}
            </a>
          ) : (
            <p className="mb-1 text-xs text-gray-700 dark:text-gray-300">
              {track.artists[0]?.name}
            </p>
          )}
          
          {/* Album Name */}
          <a
            href={track.album?.external_urls?.spotify || `https://open.spotify.com/album/${track.album?.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block cursor-pointer text-xs italic text-gray-600 transition-colors hover:text-[#3d38f5] hover:underline dark:text-gray-400 dark:hover:text-[#8b87ff]"
          >
            {track.album?.name}
          </a>
        </div>

        {genres.length > 0 && (
          <div className="mb-4 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {genres.join(" • ")}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-1 h-1 w-full overflow-hidden rounded-full bg-gray-300 dark:bg-white/10">
            <div
              className="h-full bg-linear-to-r from-[#3d38f5] to-[#8b87ff] transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Timestamps */}
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>{currentTime}</span>
            <span>{timeRemaining}</span>
          </div>
        </div>

        {track.external_urls?.spotify && (
          <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center space-x-2 rounded-full border border-gray-300 bg-gray-900/10 px-4 py-2 text-xs transition-colors hover:bg-gray-900/20 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <span>Listen on Spotify</span>
          </a>
        )}
      </div>
    </div>
  );
};
