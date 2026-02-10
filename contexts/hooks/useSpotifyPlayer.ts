import { useCallback, useEffect, useState } from "react";

import type { SpotifyPlayerState } from "@/types/spotify";

// Constants
const SPOTIFY_SDK_URL = "https://sdk.scdn.co/spotify-player.js";
const SPOTIFY_PLAYER_NAME = "Inside The Cranium Web Player";
const DEFAULT_VOLUME = 0.5;
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }
}

declare namespace Spotify {
  class Player {
    constructor(options: {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    });
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, callback: (data: any) => void): void;
    removeListener(event: string): void;
    getCurrentState(): Promise<any>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(position_ms: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
  }
}

// Helper to build Spotify player API URL
const buildPlayerUrl = (deviceId: string): string =>
  `${SPOTIFY_API_BASE}/me/player/play?device_id=${deviceId}`;

// Helper to load Spotify SDK script
const loadSpotifySDK = (): void => {
  const script = document.createElement("script");
  script.src = SPOTIFY_SDK_URL;
  script.async = true;
  document.body.appendChild(script);
};

export const useSpotifyPlayer = (accessToken: string | undefined) => {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(
    null,
  );
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    loadSpotifySDK();

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: SPOTIFY_PLAYER_NAME,
        getOAuthToken: (cb) => cb(accessToken),
        volume: DEFAULT_VOLUME,
      });

      // Error handling
      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error("Spotify Player initialization error:", message);
        setError(message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error("Spotify Player authentication error:", message);
        setError(message);
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error("Spotify Player account error:", message);
        setError("Spotify Premium is required to use the web player");
      });

      spotifyPlayer.addListener("playback_error", ({ message }) => {
        console.error("Spotify Player playback error:", message);
        setError(message);
      });

      // Ready
      spotifyPlayer.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        setIsReady(true);
        setError(null);
      });

      // Not Ready
      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        setIsReady(false);
      });

      // Player state changed
      spotifyPlayer.addListener("player_state_changed", (state) => {
        setPlayerState(state);
      });

      // Connect to the player
      spotifyPlayer.connect();

      setPlayer(spotifyPlayer);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const play = useCallback(
    async (spotify_uri?: string) => {
      if (!deviceId || !accessToken) return;

      await fetch(buildPlayerUrl(deviceId), {
        method: "PUT",
        body: JSON.stringify(spotify_uri ? { uris: [spotify_uri] } : undefined),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    [deviceId, accessToken],
  );

  const pause = useCallback(() => {
    player?.pause();
  }, [player]);

  const resume = useCallback(() => {
    player?.resume();
  }, [player]);

  const togglePlay = useCallback(() => {
    player?.togglePlay();
  }, [player]);

  const skipToNext = useCallback(() => {
    player?.nextTrack();
  }, [player]);

  const skipToPrevious = useCallback(() => {
    player?.previousTrack();
  }, [player]);

  const seek = useCallback(
    (position_ms: number) => {
      player?.seek(position_ms);
    },
    [player],
  );

  return {
    player,
    deviceId,
    isReady,
    error,
    playerState,
    play,
    pause,
    resume,
    togglePlay,
    skipToNext,
    skipToPrevious,
    seek,
  };
};
