"use client";

import useSWR from "swr";

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

import type { NowPlayingTrack, RecentlyPlayedResponse } from "@/types/spotify";

import { useSpotifyPlayer } from "./hooks/useSpotifyPlayer";

export type { NowPlayingTrack };

interface WebPlayerControls {
  isReady: boolean;
  deviceId: string | null;
  error: string | null;
  play: (uri?: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  skipToNext: () => void;
  skipToPrevious: () => void;
}

interface AppContextType {
  isListening: boolean;
  setIsListening: Dispatch<SetStateAction<boolean>>;
  nowPlayingTrack: NowPlayingTrack | null;
  recentlyPlayedTrack: RecentlyPlayedResponse | null;
  accessToken: string | undefined;
  nowPlayingGenres: string[];
  isLoadingInitialData: boolean;
  webPlayer: WebPlayerControls | null;
  enableWebPlayer: boolean;
  setEnableWebPlayer: Dispatch<SetStateAction<boolean>>;
}

// Create a context object with initial values
const MyContext = createContext<AppContextType>({
  isListening: false,
  setIsListening: () => {},
  nowPlayingTrack: null,
  recentlyPlayedTrack: null,
  accessToken: undefined,
  nowPlayingGenres: [],
  isLoadingInitialData: true,
  webPlayer: null,
  enableWebPlayer: false,
  setEnableWebPlayer: () => {},
});

const TOKEN_REFRESH_INTERVAL = 3600000; // 1 hour
const TRACK_POLLING_INTERVAL = 5000; // 5 seconds
const GENRE_CACHE_DURATION = 86400000; // 24 hours (genres rarely change)
const REVALIDATION_DELAY = 2000; // 2 seconds

// Token fetcher helper
const tokenFetcher = (url: string) =>
  fetch(url, { method: "GET" })
    .then((res) => res.json())
    .then((data) => data.access_token);

// Track fetcher helper
const createTrackFetcher = (accessToken: string | undefined) => {
  return (url: string) =>
    fetch(url, {
      headers: accessToken ? { access_token: accessToken } : {},
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            console.warn(`[AppContext] Auth error on ${url} (token not ready)`);
            return null;
          }
          if (res.status === 429) {
            console.warn(`[AppContext] Rate limited on ${url}`);
            return null;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .catch((err) => {
        console.error(err);
        return null;
      });
};

// Create a provider component
export const AppContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [nowPlayingTrack, setNowPlayingTrack] =
    useState<NowPlayingTrack | null>(null);
  const [enableWebPlayer, setEnableWebPlayer] = useState(false);

  const { data: accessToken } = useSWR<string>(
    "/api/spotify/auth/token",
    tokenFetcher,
    { refreshInterval: TOKEN_REFRESH_INTERVAL },
  );

  const spotifyPlayer = useSpotifyPlayer(
    enableWebPlayer ? accessToken : undefined,
  );

  const trackFetcher = createTrackFetcher(accessToken);

  const { data: currentlyPlayingTrack, isLoading: isLoadingCurrentlyPlaying } =
    useSWR(
      accessToken ? "/api/spotify/player/currently-playing" : null,
      trackFetcher,
      {
        refreshInterval: TRACK_POLLING_INTERVAL,
        refreshWhenHidden: false,
        refreshWhenOffline: false,
        onSuccess: (data) => {
          if (data) {
            setNowPlayingTrack(data);
            setIsListening(data.is_playing);
          } else {
            // Don't clear nowPlayingTrack - keep it to show last played song
            setIsListening(false);
          }
        },
      },
    );

  // Separate fetcher for recently played (fails silently)
  const recentlyPlayedFetcher = (url: string) =>
    fetch(url, {
      headers: accessToken
        ? {
            access_token: accessToken,
          }
        : {},
    })
      .then((res) => {
        if (!res.ok) {
          // Silently handle auth errors
          if (res.status === 401) {
            console.warn(`[AppContext] Auth error on ${url} (token not ready)`);
            return null;
          }
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .catch(() => null); // Fail silently

  // Fetch recently played track (cached indefinitely, invalidated on-demand)
  const {
    data: recentlyPlayed,
    mutate: mutateRecentlyPlayed,
    isLoading: isLoadingRecentlyPlayed,
  } = useSWR<RecentlyPlayedResponse>(
    accessToken ? "/api/spotify/player/recently-played" : null,
    trackFetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  const genreFetcher = (url: string) =>
    fetch(url, {
      headers: accessToken ? { access_token: accessToken } : {},
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.artists || data.artists.length === 0) return [];
        const allGenres = data.artists.flatMap(
          (artist: { genres?: string[] }) => artist.genres || [],
        );
        return [...new Set<string>(allGenres)].slice(0, 3);
      })
      .catch(() => []);

  // Fetch genres for currently playing track
  const artistIds = nowPlayingTrack?.item?.artists?.map((a) => a.id).join(",");
  const { data: nowPlayingGenres = [] } = useSWR(
    artistIds && accessToken
      ? `/api/spotify/artists/genres?artistIds=${artistIds}`
      : null,
    genreFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: GENRE_CACHE_DURATION,
    },
  );

  // Only show loading state if we're fetching AND don't have any data yet
  const isLoadingInitialData =
    (isLoadingCurrentlyPlaying || isLoadingRecentlyPlayed) &&
    !currentlyPlayingTrack &&
    !recentlyPlayed;

  useEffect(() => {
    if (!isListening && accessToken) {
      const timer = setTimeout(() => {
        import("../app/actions/revalidate").then(
          ({ invalidateRecentlyPlayed }) => invalidateRecentlyPlayed(),
        );
        mutateRecentlyPlayed();
      }, REVALIDATION_DELAY);
      return () => clearTimeout(timer);
    }
  }, [
    nowPlayingTrack?.item?.id,
    isListening,
    accessToken,
    mutateRecentlyPlayed,
  ]);

  // Derive if web player is the active device
  const isWebPlayerActive =
    currentlyPlayingTrack &&
    spotifyPlayer.deviceId &&
    currentlyPlayingTrack.device?.id === spotifyPlayer.deviceId;

  // Update state when SDK player state changes (only if web player is active)
  useEffect(() => {
    if (spotifyPlayer.playerState && isWebPlayerActive) {
      const sdkTrack = spotifyPlayer.playerState.track_window.current_track;

      // Convert SDK format to our NowPlayingTrack format
      const formattedTrack: NowPlayingTrack = {
        item: {
          id: sdkTrack.id,
          name: sdkTrack.name,
          artists: sdkTrack.artists.map((artist) => ({
            id: artist.uri.split(":")[2],
            name: artist.name,
          })),
          album: {
            name: sdkTrack.album.name,
            images: sdkTrack.album.images.map((img) => ({ url: img.url })),
          },
          duration_ms: sdkTrack.duration_ms,
        },
        progress_ms: spotifyPlayer.playerState.position,
        is_playing: !spotifyPlayer.playerState.paused,
      };

      setNowPlayingTrack(formattedTrack);
      setIsListening(!spotifyPlayer.playerState.paused);
    }
  }, [spotifyPlayer.playerState, isWebPlayerActive]);

  return (
    <MyContext.Provider
      value={{
        isListening,
        setIsListening,
        nowPlayingTrack,
        recentlyPlayedTrack: recentlyPlayed || null,
        accessToken,
        nowPlayingGenres,
        isLoadingInitialData,
        enableWebPlayer,
        setEnableWebPlayer,
        webPlayer:
          enableWebPlayer && spotifyPlayer.isReady
            ? {
                isReady: spotifyPlayer.isReady,
                deviceId: spotifyPlayer.deviceId,
                error: spotifyPlayer.error,
                play: spotifyPlayer.play,
                pause: spotifyPlayer.pause,
                resume: spotifyPlayer.resume,
                togglePlay: spotifyPlayer.togglePlay,
                skipToNext: spotifyPlayer.skipToNext,
                skipToPrevious: spotifyPlayer.skipToPrevious,
              }
            : null,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => useContext(MyContext);
