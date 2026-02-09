"use client";

// contexts/MyContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import useSWR from "swr";
import { useSpotifyPlayer } from "./hooks/useSpotifyPlayer";

// Define interfaces for context state
export interface NowPlayingTrack {
  item?: {
    id: string;
    name: string;
    artists: Array<{ id: string; name: string }>;
    album: {
      name: string;
      images: Array<{ url: string }>;
    };
    duration_ms: number;
    external_urls?: {
      spotify: string;
    };
  };
  progress_ms?: number;
  is_playing: boolean;
  device?: {
    id: string;
    name: string;
    type: string;
  };
}

interface RecentlyPlayedTrack {
  items?: Array<{
    track: {
      id: string;
      name: string;
      artists: Array<{ id: string; name: string }>;
      album: {
        name: string;
        images: Array<{ url: string }>;
      };
      duration_ms: number;
    };
    played_at: string;
  }>;
}

interface AppContextType {
  isListening: boolean;
  setIsListening: Dispatch<SetStateAction<boolean>>;
  nowPlayingTrack: NowPlayingTrack | null;
  recentlyPlayedTrack: RecentlyPlayedTrack | null;
  accessToken: string | undefined;
  nowPlayingGenres: string[];
  isLoadingInitialData: boolean;
  // Web Player SDK
  webPlayer: {
    isReady: boolean;
    deviceId: string | null;
    error: string | null;
    play: (uri?: string) => Promise<void>;
    pause: () => void;
    resume: () => void;
    togglePlay: () => void;
    skipToNext: () => void;
    skipToPrevious: () => void;
  } | null;
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

// Create a provider component
export const AppContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [nowPlayingTrack, setNowPlayingTrack] =
    useState<NowPlayingTrack | null>(null);
  const [enableWebPlayer, setEnableWebPlayer] = useState<boolean>(false);

  // Fetch access token using native fetch
  const tokenFetcher = (url: string) =>
    fetch(url, { method: "GET" })
      .then((res) => res.json())
      .then((data) => data.access_token);

  const { data: accessToken } = useSWR<string>(
    "/api/spotify/auth/token",
    tokenFetcher,
    {
      refreshInterval: 3600000, // 1 hour in milliseconds
    },
  );

  // Initialize Spotify Web Player SDK only when enabled
  const spotifyPlayer = useSpotifyPlayer(
    enableWebPlayer ? accessToken : undefined,
  );

  // Fetch currently playing track using native fetch
  const trackFetcher = (url: string) =>
    fetch(url, {
      headers: accessToken
        ? {
            access_token: accessToken,
          }
        : {},
    })
      .then((res) => {
        if (!res.ok) {
          // Handle auth errors and rate limiting gracefully - don't throw, just return null
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

  const { data: currentlyPlayingTrack, isLoading: isLoadingCurrentlyPlaying } = useSWR(
    accessToken ? "/api/spotify/player/currently-playing" : null,
    trackFetcher,
    {
      refreshInterval: 5000, // 5s polling for responsive UI
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
  const { data: recentlyPlayed, mutate: mutateRecentlyPlayed, isLoading: isLoadingRecentlyPlayed } = useSWR(
    accessToken ? "/api/spotify/player/recently-played" : null,
    recentlyPlayedFetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  // Genre fetcher
  const genreFetcher = (url: string) =>
    fetch(url, {
      headers: accessToken ? { access_token: accessToken } : {},
    })
      .then((res) => {
        if (!res.ok) {
          // Silently handle auth errors
          if (res.status === 401) {
            console.warn(`[AppContext] Auth error on ${url} (token not ready)`);
            return null;
          }
          console.warn(`[AppContext] Genre API returned ${res.status}`);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data?.artists || data.artists.length === 0) return [];
        const allGenres = data.artists.flatMap(
          (artist: any) => artist.genres || [],
        );
        return [...new Set<string>(allGenres as string[])].slice(0, 3);
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
      dedupingInterval: 60000, // Cache genres for 1 minute
    },
  );

  // Derive loading state
  const isLoadingInitialData = isLoadingCurrentlyPlaying || isLoadingRecentlyPlayed;

  // Invalidate recently played when track changes or listening stops
  useEffect(() => {
    if (!isListening && accessToken) {
      const timer = setTimeout(() => {
        import("../app/actions/revalidate").then(
          ({ invalidateRecentlyPlayed }) => invalidateRecentlyPlayed(),
        );
        mutateRecentlyPlayed();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [nowPlayingTrack?.item?.id, isListening, accessToken, mutateRecentlyPlayed]);

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
