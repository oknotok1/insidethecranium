"use client";

import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

export interface PreviewTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  spotifyUrl: string;
  youtubeVideoId?: string; // YouTube video ID for playback
  genres?: string[];
}

interface PreviewPlayerContextType {
  // Current track
  currentTrack: PreviewTrack | null;
  isPlaying: boolean;
  
  // Controls
  play: (track: PreviewTrack) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  togglePlayPause: (track: PreviewTrack) => void;
  // Internal state setters (for YouTube player to sync state)
  setIsPlaying: (playing: boolean) => void;
}

const PreviewPlayerContext = createContext<PreviewPlayerContextType | undefined>(
  undefined,
);

export const PreviewPlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<PreviewTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((track: PreviewTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback((track: PreviewTrack) => {
    const isSameTrack = currentTrack?.id === track.id;
    
    if (isSameTrack && isPlaying) {
      // Same track and currently playing, pause it
      setIsPlaying(false);
    } else if (isSameTrack && !isPlaying) {
      // Same track but paused, resume it
      setIsPlaying(true);
    } else {
      // Different track, play it
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  }, [currentTrack, isPlaying]);

  return (
    <PreviewPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        play,
        pause,
        resume,
        stop,
        togglePlayPause,
        setIsPlaying,
      }}
    >
      {children}
    </PreviewPlayerContext.Provider>
  );
};

export const usePreviewPlayer = (): PreviewPlayerContextType => {
  const context = useContext(PreviewPlayerContext);
  if (!context) {
    throw new Error(
      "usePreviewPlayer must be used within a PreviewPlayerProvider",
    );
  }
  return context;
};
