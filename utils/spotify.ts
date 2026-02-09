/**
 * Spotify API Utilities
 */

import { cache } from "react";
import { logger } from "./logger";

/**
 * Fetches a Spotify access token using the refresh token
 * Uses Next.js Data Cache with 40-minute TTL (safe margin before 60-min expiration)
 * Wrapped with React cache() to deduplicate requests within a single render
 */
export const getSpotifyAccessToken = cache(async (): Promise<string> => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;

  const token = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  if (SPOTIFY_REFRESH_TOKEN) {
    params.append("refresh_token", SPOTIFY_REFRESH_TOKEN);
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      next: {
        revalidate: 2400, // Cache for 40 minutes (safe margin before 60-min expiration)
        tags: ["spotify-token"],
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error: any) {
    logger.error("Spotify", `Failed to get access token: ${error.message}`);
    throw error;
  }
});

/**
 * Forces a fresh access token by bypassing cache
 * Used when a cached token has expired (401 error)
 */
export const getFreshSpotifyAccessToken = async (): Promise<string> => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } =
    process.env;

  const token = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  if (SPOTIFY_REFRESH_TOKEN) {
    params.append("refresh_token", SPOTIFY_REFRESH_TOKEN);
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
      cache: "no-store", // Force fresh token
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    logger.log("Spotify", "Fetched fresh access token (bypassed cache)");
    return data.access_token;
  } catch (error: any) {
    logger.error("Spotify", `Failed to get fresh access token: ${error.message}`);
    throw error;
  }
};

/**
 * Spotify API configuration constants
 */
export const SPOTIFY_API = {
  BASE_URL: "https://api.spotify.com/v1",
  TOKEN_URL: "https://accounts.spotify.com/api/token",
  MAX_ARTISTS_PER_REQUEST: 50,
  MAX_TRACKS_PER_REQUEST: 50,
} as const;
