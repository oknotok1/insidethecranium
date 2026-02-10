import { useEffect, useMemo, useRef } from "react";

import type {
  NowPlayingTrack,
  RecentlyPlayedResponse,
  Track,
} from "@/types/spotify";

export const useDisplayTrack = (
  isListening: boolean,
  nowPlayingTrack: NowPlayingTrack | null,
  recentlyPlayedTrack: RecentlyPlayedResponse | null,
) => {
  const lastValidTrack = useRef<Track | undefined>(undefined);

  const currentTrack = useMemo(
    () =>
      isListening
        ? nowPlayingTrack?.item
        : nowPlayingTrack?.item || recentlyPlayedTrack?.items?.[0]?.track,
    [isListening, nowPlayingTrack?.item, recentlyPlayedTrack?.items],
  );

  useEffect(() => {
    if (currentTrack) {
      lastValidTrack.current = currentTrack;
    }
  }, [currentTrack]);

  return currentTrack || lastValidTrack.current;
};
