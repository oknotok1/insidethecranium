import { useEffect, useMemo, useState } from "react";

interface Track {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
}

interface NowPlayingTrack {
  item?: Track;
  progress_ms?: number;
  is_playing: boolean;
}

interface RecentlyPlayedTrack {
  items?: Array<{
    track: Track;
    played_at: string;
  }>;
}

export const useDisplayTrack = (
  isListening: boolean,
  nowPlayingTrack: NowPlayingTrack | null,
  recentlyPlayedTrack: RecentlyPlayedTrack | null,
) => {
  // Calculate the current track based on listening state
  const currentTrack = useMemo(() => {
    if (isListening) {
      return nowPlayingTrack?.item;
    }
    // When not listening, prefer nowPlayingTrack (what was just playing)
    // Only use recentlyPlayedTrack if nowPlayingTrack doesn't exist
    return nowPlayingTrack?.item || recentlyPlayedTrack?.items?.[0]?.track;
  }, [isListening, nowPlayingTrack?.item, recentlyPlayedTrack?.items]);

  // Track the last valid track to prevent flickering using state
  const [lastValidTrack, setLastValidTrack] = useState<Track | undefined>(
    undefined,
  );

  // Update lastValidTrack when we have a valid currentTrack
  // This caches the last valid track to prevent UI flickering
  useEffect(() => {
    if (currentTrack) {
      // Intentionally caching last valid track for UI stability
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLastValidTrack(currentTrack);
    }
  }, [currentTrack]);

  // Return current track if available, otherwise return last valid track
  return currentTrack ?? lastValidTrack;
};
