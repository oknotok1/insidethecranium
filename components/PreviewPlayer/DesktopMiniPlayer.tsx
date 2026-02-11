"use client";

import { X, ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import Image from "next/image";

import { YouTubePlayer } from "./YouTubePlayer";
import { usePreviewPlayer } from "@/contexts/PreviewPlayerContext";

export function DesktopMiniPlayer() {
  const { currentTrack, stop, isPlaying, pause, resume } = usePreviewPlayer();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [hasCountdownRun, setHasCountdownRun] = useState(false);
  const [isHoveringMinimize, setIsHoveringMinimize] = useState(false);
  const previousTrackRef = useRef<string | null>(null);
  const lastTrackRef = useRef(currentTrack);
  const lastTrackIdRef = useRef<string | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Keep track of the last valid track for display during closing animation
  useEffect(() => {
    if (currentTrack) {
      lastTrackRef.current = currentTrack;
    }
  }, [currentTrack]);

  // Reset component when a track starts playing after being closed
  useEffect(() => {
    const hadNoTrack = !lastTrackIdRef.current;
    const isNewTrack = currentTrack && lastTrackIdRef.current !== currentTrack.id;
    
    if (currentTrack && (hadNoTrack || isNewTrack)) {
      if (hadNoTrack) {
        // Player was closed (no track was playing) - reset everything for fresh instance
        setIsMinimized(false);
        setIsClosing(false);
        setHasCountdownRun(false);
        setCountdown(null);
        setIsHoveringMinimize(false);
      }
      // Update the last track ID for both cases (new instance or track change while playing)
      lastTrackIdRef.current = currentTrack.id;
    }
  }, [currentTrack]);

  // Auto-minimize countdown on first open (per session)
  useEffect(() => {
    // Start countdown only once per session when player first opens (and not hovering)
    if (currentTrack && !hasCountdownRun && !isMinimized && !isClosing && !isHoveringMinimize) {
      // Start countdown if it hasn't been set yet
      if (countdown === null) {
        setCountdown(5);
      }
      
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            // Countdown finished, minimize
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            setIsMinimized(true);
            setHasCountdownRun(true);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (isHoveringMinimize && countdownIntervalRef.current) {
      // Pause countdown when hovering
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }

    // Cleanup interval on unmount or state change
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [currentTrack, hasCountdownRun, isMinimized, isClosing, isHoveringMinimize, countdown]);

  // Manual minimize should cancel countdown
  const handleMinimize = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(null);
    setIsMinimized(true);
    setHasCountdownRun(true);
    setIsHoveringMinimize(false);
  };

  // Cancel countdown - keep player expanded
  const handleCancelCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(null);
    setHasCountdownRun(true);
    setIsHoveringMinimize(false);
  };

  // Show toast when track changes while minimized
  useEffect(() => {
    if (!currentTrack || !isMinimized) {
      previousTrackRef.current = currentTrack?.id || null;
      return;
    }

    // Track changed while minimized
    if (previousTrackRef.current && previousTrackRef.current !== currentTrack.id) {
      const artwork = currentTrack.album.images[0]?.url;
      
      toast.custom(
        (t) => (
          <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90">
            {/* Now Playing Title */}
            <div className="text-xs font-semibold text-gray-900 dark:text-white">
              Now Playing
            </div>
            
            {/* Track Info with Artwork */}
            <div className="flex items-center gap-3">
              {/* Album Artwork */}
              {artwork && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={artwork}
                    alt={currentTrack.album.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              {/* Track Details */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {currentTrack.name}
                </div>
                <div className="truncate text-xs text-gray-600 dark:text-gray-400">
                  {currentTrack.artists[0]?.name}
                </div>
              </div>
            </div>
          </div>
        ),
        { duration: 3000 }
      );
    }

    previousTrackRef.current = currentTrack.id;
  }, [currentTrack, isMinimized]);

  const handleClose = () => {
    setIsClosing(true);
    // Clear countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setCountdown(null);
    // Clear track refs immediately so next play starts fresh
    lastTrackIdRef.current = null;
    // Wait for animation to complete before actually stopping
    setTimeout(() => {
      stop();
      lastTrackRef.current = null;
    }, 300);
  };

  // Use current track or last track during closing animation
  const displayTrack = currentTrack || lastTrackRef.current;

  if (!displayTrack) return null;

  return (
    <>
      {/* Main Player - slides off screen when minimized or closing */}
      <div
        className={`fixed bottom-24 z-50 w-[400px] rounded-xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-white/5 dark:bg-black/10 ${
          isMinimized || isClosing ? "translate-x-[calc(100%+1.5rem)] opacity-0" : "translate-x-0 opacity-100"
        }`}
        style={{ right: "1.5rem" }}
      >
        {/* Header with track info and controls */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="shrink-0 text-xs font-semibold text-gray-900 dark:text-white">
                Now Playing
              </span>
              <span className="truncate text-xs text-gray-600 dark:text-gray-400">
                {displayTrack.name} · {displayTrack.artists[0]?.name}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {/* Show button group on hover during countdown */}
            {countdown !== null && isHoveringMinimize ? (
              <div
                className="flex items-center overflow-hidden rounded-lg bg-gray-900/10 dark:bg-white/15"
                onMouseEnter={() => setIsHoveringMinimize(true)}
                onMouseLeave={() => setIsHoveringMinimize(false)}
              >
                <button
                  onClick={handleMinimize}
                  className="cursor-pointer border-r border-gray-900/10 bg-white/50 px-2.5 py-1.5 text-xs font-medium transition-all hover:bg-white/70 dark:border-white/10 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20"
                  aria-label="Continue minimize"
                >
                  Minimize
                </button>
                <button
                  onClick={handleCancelCountdown}
                  className="cursor-pointer px-2.5 py-1.5 text-xs font-medium transition-all hover:bg-white/50 dark:text-gray-300 dark:hover:bg-white/10"
                  aria-label="Cancel countdown"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleMinimize}
                onMouseEnter={() => countdown !== null ? setIsHoveringMinimize(true) : undefined}
                onMouseLeave={() => setIsHoveringMinimize(false)}
                className="cursor-pointer rounded-lg bg-gray-900/10 px-3 py-1.5 transition-all hover:bg-gray-900/15 dark:bg-white/15 dark:hover:bg-white/20"
                aria-label="Minimize player"
              >
                <div className="flex items-center gap-2">
                  {countdown !== null && (
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                      {countdown}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                </div>
              </button>
            )}
            <button
              onClick={handleClose}
              className="cursor-pointer rounded-full p-1.5 transition-colors hover:bg-white/50 dark:hover:bg-white/10"
              aria-label="Close player"
            >
              <X className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* YouTube Player */}
        <div className="overflow-hidden rounded-lg">
          {displayTrack.youtubeVideoId ? (
            <YouTubePlayer videoId={displayTrack.youtubeVideoId} height={225} />
          ) : (
            <div className="flex h-[225px] items-center justify-center text-sm text-gray-500">
              Loading video...
            </div>
          )}
        </div>
      </div>

      {/* Minimized Tab - only visible when minimized */}
      {isMinimized && (
        <button
          onClick={() => setIsMinimized(false)}
          className="group fixed bottom-24 right-0 z-50 flex cursor-pointer animate-pulse items-center gap-3 rounded-l-xl border border-r-0 border-[#3d38f5]/20 bg-linear-to-l from-[#3d38f5]/8 to-[#3d38f5]/4 py-3 pl-4 pr-3 shadow-2xl backdrop-blur-xl transition-all hover:from-[#3d38f5] hover:to-[#3d38f5]/90 hover:shadow-[0_0_20px_rgba(61,56,245,0.5)] dark:border-[#3d38f5]/30 dark:from-[#3d38f5]/10 dark:to-[#3d38f5]/5 dark:hover:from-[#3d38f5] dark:hover:to-[#3d38f5]/90"
          style={{ 
            animationDuration: "3s",
            animationTimingFunction: "ease-in-out"
          }}
          aria-label="Show player"
        >
          {/* Play/Pause Button */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (isPlaying) {
                pause();
              } else {
                resume();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                if (isPlaying) {
                  pause();
                } else {
                  resume();
                }
              }
            }}
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center justify-center rounded-lg bg-gray-900/80 p-1.5 transition-all hover:bg-gray-900 dark:bg-white/90 dark:hover:bg-white"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 fill-current text-white dark:text-gray-900" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current text-white dark:text-gray-900" />
            )}
          </div>

          {/* Track Info */}
          <div className="flex-1 text-left">
            <div className="text-xs font-semibold text-gray-900 transition-colors group-hover:text-white dark:text-white">
              Now Playing
            </div>
            <div className="mt-0.5 max-w-[120px] truncate text-xs text-gray-600 transition-colors group-hover:text-white/90 dark:text-gray-400 dark:group-hover:text-white/90">
              {displayTrack.name}
            </div>
          </div>

          {/* Expand Icon */}
          <ChevronLeft className="h-4 w-4 shrink-0 text-gray-600 transition-all group-hover:translate-x-[-2px] group-hover:text-white/90 dark:text-gray-400 dark:group-hover:text-white/90" />
        </button>
      )}
    </>
  );
}
