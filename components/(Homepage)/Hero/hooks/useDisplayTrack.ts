import { useMemo, useRef, useEffect } from "react";

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
  // Keep track of the last valid track to prevent flickering
  const lastValidTrack = useRef<Track | undefined>(undefined);

  const currentTrack = useMemo(() => {
    if (isListening) {
      return nowPlayingTrack?.item;
    }

    // When not listening, prefer nowPlayingTrack (what was just playing)
    // Only use recentlyPlayedTrack if nowPlayingTrack doesn't exist
    // This ensures we show the song that was just stopped, not stale API data
    return nowPlayingTrack?.item || recentlyPlayedTrack?.items?.[0]?.track;
  }, [isListening, nowPlayingTrack?.item, recentlyPlayedTrack?.items]);

  // Update last valid track whenever we have a valid current track
  useEffect(() => {
    if (currentTrack) {
      lastValidTrack.current = currentTrack;
    }
  }, [currentTrack]);

  // Return current track if available, otherwise return last valid track
  return currentTrack || lastValidTrack.current;
};
