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
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";

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
  webPlayer: null,
  enableWebPlayer: false,
  setEnableWebPlayer: () => {},
});

// Create a provider component
export const AppContext: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [nowPlayingTrack, setNowPlayingTrack] =
    useState<NowPlayingTrack | null>(null);
  const [recentlyPlayedTrack, setRecentlyPlayedTrack] =
    useState<RecentlyPlayedTrack | null>(null);
  const [enableWebPlayer, setEnableWebPlayer] = useState<boolean>(false);
  const [nowPlayingGenres, setNowPlayingGenres] = useState<string[]>([]);
  const [previousTrackId, setPreviousTrackId] = useState<string | null>(null);

  // Initialize Spotify Web Player SDK only when enabled
  const spotifyPlayer = useSpotifyPlayer(
    enableWebPlayer ? accessToken : undefined,
  );

  // Fetch access token using native fetch
  const tokenFetcher = (url: string) =>
    fetch(url, { method: "GET" })
      .then((res) => res.json())
      .then((data) => data.access_token);

  const { data: fetchedAccessToken } = useSWR<string>(
    "/api/spotify/token",
    tokenFetcher,
    {
      refreshInterval: 3600000, // 1 hour in milliseconds
    },
  );

  // Update access token when a new one is fetched
  useEffect(() => {
    if (fetchedAccessToken) {
      setAccessToken(fetchedAccessToken);
    }
  }, [fetchedAccessToken]);

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
          // Handle rate limiting gracefully - don't throw, just return null
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

  // Dynamic polling: faster when listening, slower when idle
  const [refreshInterval, setRefreshInterval] = useState(5000);

  const { data: currentlyPlayingTrack } = useSWR(
    accessToken ? "/api/spotify/currently-playing" : null,
    trackFetcher,
    {
      refreshInterval, // Dynamic refresh interval
      // Only refresh when window is focused
      refreshWhenHidden: false,
      // Only refresh when online
      refreshWhenOffline: false,
    },
  );

  // Update now playing state
  useEffect(() => {
    if (currentlyPlayingTrack) {
      setNowPlayingTrack(currentlyPlayingTrack);
      setIsListening(currentlyPlayingTrack.is_playing);

      // Keep consistent 5s polling for responsive UI
      setRefreshInterval(5000);
    } else {
      // Don't clear nowPlayingTrack - keep it to show last played song
      // Only update the listening state
      setIsListening(false);
      setRefreshInterval(5000); // Keep 5s polling for responsive updates
    }
  }, [currentlyPlayingTrack]);

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
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .catch(() => null); // Fail silently

  // Fetch recently played track (cached indefinitely, invalidated on-demand)
  const { data: recentlyPlayed, mutate: mutateRecentlyPlayed } = useSWR(
    accessToken ? "/api/spotify/recently-played" : null,
    recentlyPlayedFetcher,
    {
      revalidateOnMount: true, // Fetch on mount
      revalidateOnFocus: false, // Don't refetch on focus
      revalidateOnReconnect: false, // Don't refetch on reconnect
      shouldRetryOnError: false, // Don't retry on error
      // No refreshInterval - cache is used until explicitly invalidated
    },
  );

  // Update recently played state
  useEffect(() => {
    if (recentlyPlayed) {
      setRecentlyPlayedTrack(recentlyPlayed);
    }
  }, [recentlyPlayed]);

  // Fetch genres for currently playing track
  useEffect(() => {
    const fetchGenres = async () => {
      if (!nowPlayingTrack?.item?.artists?.length || !accessToken) {
        setNowPlayingGenres([]);
        return;
      }

      try {
        const artistIds = nowPlayingTrack.item.artists
          .map((a) => a.id)
          .join(",");
        const response = await fetch(
          `/api/spotify/artists/genres?artistIds=${artistIds}`,
          {
            headers: accessToken
              ? {
                  access_token: accessToken,
                }
              : {},
          },
        );

        if (!response.ok) {
          // Log but don't throw - handle gracefully
          console.warn(
            `[AppContext] Genre API returned ${response.status}, falling back to no genres`,
          );
          setNowPlayingGenres([]);
          return;
        }

        const data = await response.json();

        // Handle case where API returns error with empty artists array
        if (!data.artists || data.artists.length === 0) {
          console.warn("[AppContext] No artists data returned for now playing");
          setNowPlayingGenres([]);
          return;
        }

        // Collect all unique genres from all artists, limit to 3
        const allGenres = data.artists.flatMap(
          (artist: any) => artist.genres || [],
        );
        const uniqueGenres = [...new Set<string>(allGenres as string[])].slice(
          0,
          3,
        );
        setNowPlayingGenres(uniqueGenres);
      } catch (error: any) {
        console.error("[AppContext] Failed to fetch genres:", error.message);
        setNowPlayingGenres([]); // Gracefully degrade to no genres
      }
    };

    fetchGenres();
  }, [nowPlayingTrack?.item?.id, accessToken]);

  // Invalidate recently played cache when track changes
  useEffect(() => {
    const currentTrackId = nowPlayingTrack?.item?.id;

    if (currentTrackId && currentTrackId !== previousTrackId) {
      // Track has changed - invalidate recently played cache
      console.log(
        "[AppContext] Track changed, invalidating recently-played cache",
      );

      // Import and call server action
      import("@/app/actions/revalidate").then(
        ({ invalidateRecentlyPlayed }) => {
          invalidateRecentlyPlayed();
        },
      );

      // Update tracking
      setPreviousTrackId(currentTrackId);

      // Trigger SWR revalidation after short delay
      setTimeout(() => {
        mutateRecentlyPlayed();
      }, 2000);
    }
  }, [nowPlayingTrack?.item?.id, previousTrackId, mutateRecentlyPlayed]);

  // When user stops listening, immediately fetch recently played
  useEffect(() => {
    if (!isListening && accessToken) {
      // Wait a moment for Spotify to register the track as played
      const timer = setTimeout(() => {
        mutateRecentlyPlayed();
      }, 2000); // 2 second delay to ensure Spotify has updated

      return () => clearTimeout(timer);
    }
  }, [isListening, accessToken, mutateRecentlyPlayed]);

  // Track if web player is the active device
  const [isWebPlayerActive, setIsWebPlayerActive] = useState(false);

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

  // Check if current playback is from web player
  useEffect(() => {
    if (currentlyPlayingTrack && spotifyPlayer.deviceId) {
      // Check if the current device matches our web player device ID
      const isPlayingOnWebDevice =
        currentlyPlayingTrack.device?.id === spotifyPlayer.deviceId;
      setIsWebPlayerActive(isPlayingOnWebDevice);
    } else {
      setIsWebPlayerActive(false);
    }
  }, [currentlyPlayingTrack, spotifyPlayer.deviceId]);

  return (
    <MyContext.Provider
      value={{
        isListening,
        setIsListening,
        nowPlayingTrack,
        recentlyPlayedTrack,
        accessToken,
        nowPlayingGenres,
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
