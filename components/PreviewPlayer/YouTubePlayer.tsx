"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { usePreviewPlayer } from "@/contexts/PreviewPlayerContext";

interface YouTubePlayerProps {
  videoId: string;
  height?: number;
  onError?: () => void;
}

// YouTube IFrame API Types
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  destroy: () => void;
}

interface YTEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerConstructor {
  new (elementId: string, config: YTPlayerConfig): YTPlayer;
}

interface YTPlayerConfig {
  height: number;
  width: number;
  videoId: string;
  playerVars: Record<string, string | number>;
  events: {
    onReady: (event: YTEvent) => void;
    onStateChange: (event: YTEvent) => void;
    onError: (event: YTEvent) => void;
  };
}

interface YouTubeAPI {
  Player: YTPlayerConstructor;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: YouTubeAPI;
  }
}

const YOUTUBE_ERROR_MESSAGES = {
  2: "Invalid video ID",
  5: "HTML5 player error",
  100: "Video not found or unavailable",
  101: "Video cannot be embedded",
  150: "Video cannot be embedded",
} as const;

export function YouTubePlayer({
  videoId,
  height = 352,
  onError: onErrorCallback,
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPlaying, setIsPlaying, currentTrack } = usePreviewPlayer();
  const isManualChange = useRef(false);

  useEffect(() => {
    const initializePlayer = () => {
      if (!containerRef.current || !window.YT) return;

      // Cleanup previous player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore cleanup errors
        }
        playerRef.current = null;
      }

      const playerId = `youtube-player-${videoId}`;
      containerRef.current.id = playerId;
      containerRef.current.innerHTML = '';
      
      playerRef.current = new window.YT.Player(playerId, {
        height,
        width: containerRef.current.offsetWidth || 400,
        videoId,
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          enablejsapi: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
        },
        events: {
          onReady: (event: YTEvent) => {
            const player = event.target;
            if (typeof player.playVideo === 'function') {
              setIsReady(true);
              setIsPlaying(true);
              try {
                player.playVideo();
              } catch {
                // Autoplay blocked by browser - user can manually start
              }
            }
          },
          onStateChange: (event: YTEvent) => {
            if (isManualChange.current) {
              isManualChange.current = false;
              return;
            }
            
            const state = event.data;
            // 1 = playing, 2 = paused, 0 = ended
            if (state === 1) {
              setIsPlaying(true);
            } else if (state === 2 || state === 0) {
              setIsPlaying(false);
            }
          },
          onError: (event: YTEvent) => {
            const errorCode = event.data as keyof typeof YOUTUBE_ERROR_MESSAGES;
            const trackName = currentTrack?.name || "This track";
            const errorMessage = YOUTUBE_ERROR_MESSAGES[errorCode] || "Unable to play this video";
            
            if (errorCode === 150 || errorCode === 101) {
              toast.error(`${trackName} cannot be played`, {
                description: "This video is restricted from embedding. Listen on Spotify instead.",
              });
            } else {
              toast.error(`${trackName} is unavailable`, {
                description: errorMessage,
              });
            }
            
            setError(errorMessage);
            setIsPlaying(false);
            onErrorCallback?.();
          },
        },
      });
    };

    const loadYouTubeAPI = () => {
      if (window.YT?.Player) {
        initializePlayer();
        return;
      }

      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
      if (existingScript) {
        const checkReady = setInterval(() => {
          if (window.YT?.Player) {
            clearInterval(checkReady);
            initializePlayer();
          }
        }, 100);
        return;
      }

      window.onYouTubeIframeAPIReady = initializePlayer;
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    };

    loadYouTubeAPI();

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore
        }
        playerRef.current = null;
      }
      setIsReady(false);
    };
  }, [videoId, height]);

  // Sync play/pause state with YouTube player
  useEffect(() => {
    if (!playerRef.current || !isReady) return;

    const player = playerRef.current;
    if (typeof player.playVideo !== 'function') return;

    try {
      const currentState = player.getPlayerState();
      const isPlayerPlaying = currentState === 1;

      if (isPlaying && !isPlayerPlaying) {
        isManualChange.current = true;
        player.playVideo();
      } else if (!isPlaying && isPlayerPlaying) {
        isManualChange.current = true;
        player.pauseVideo();
      }
    } catch {
      // Ignore playback control errors
    }
  }, [isPlaying, isReady]);

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 bg-gray-100 p-6 text-center dark:bg-white/5"
        style={{ width: "100%", height: `${height}px` }}
      >
        <div className="text-sm text-gray-600 dark:text-gray-400">{error}</div>
        {currentTrack?.spotifyUrl && (
          <a
            href={currentTrack.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#1DB954] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1ed760]"
          >
            Listen on Spotify
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="youtube-player-container"
      style={{ width: "100%", height: `${height}px` }}
    />
  );
}
