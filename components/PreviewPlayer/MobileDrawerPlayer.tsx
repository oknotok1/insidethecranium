"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { YouTubePlayer } from "./YouTubePlayer";
import { usePreviewPlayer } from "@/contexts/PreviewPlayerContext";

export function MobileDrawerPlayer() {
  const { currentTrack, stop } = usePreviewPlayer();

  if (!currentTrack) return null;

  const handleError = () => {
    // Close the drawer when there's a playback error
    stop();
  };

  return (
    <Drawer
      open={!!currentTrack}
      onOpenChange={(open) => {
        if (!open) {
          stop();
        }
      }}
      modal={false}
      dismissible={true}
      shouldScaleBackground={false}
    >
      <DrawerContent 
        className="border-t border-gray-200 bg-white/95 backdrop-blur-md dark:border-white/10 dark:bg-black/95 [&>div:first-child]:hidden"
      >
        <VisuallyHidden>
          <DrawerTitle>Now Playing</DrawerTitle>
        </VisuallyHidden>
        
        {/* Swipe indicator */}
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gray-300 dark:bg-gray-700" />

        <ExpandedPlayer track={currentTrack} onError={handleError} />
      </DrawerContent>
    </Drawer>
  );
}

interface ExpandedPlayerProps {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
    spotifyUrl: string;
    youtubeVideoId?: string;
    genres?: string[];
  };
  onError: () => void;
}

function ExpandedPlayer({ track, onError }: ExpandedPlayerProps) {
  return (
    <div
      className="flex flex-col px-4 pb-6 pt-3"
      style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))" }}
    >
      {/* YouTube Player */}
      <div className="mb-4 overflow-hidden rounded-xl">
        {track.youtubeVideoId ? (
          <YouTubePlayer
            videoId={track.youtubeVideoId}
            height={210}
            onError={onError}
          />
        ) : (
          <div className="flex h-[210px] items-center justify-center text-sm text-gray-500">
            Loading video...
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="text-center">
        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {track.name}
        </h3>
        <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
          {track.artists[0]?.name}
        </p>
        {track.genres && track.genres.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {track.genres.join(" • ")}
          </p>
        )}
      </div>
    </div>
  );
}
