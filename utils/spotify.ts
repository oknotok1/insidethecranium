/**
 * Spotify API Utilities
 */

import { cache } from "react";

import type { NextFetchOptions, UserPlaylists } from "@/types/spotify";

import { logger } from "./logger";

/**
 * Spotify credentials from environment variables
 */
const SPOTIFY_CREDENTIALS = {
  clientId: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN || "",
} as const;

/**
 * Spotify API configuration constants
 */
export const SPOTIFY_API = {
  BASE_URL: "https://api.spotify.com/v1",
  TOKEN_URL: "https://accounts.spotify.com/api/token",
  MAX_ARTISTS_PER_REQUEST: 50,
  MAX_TRACKS_PER_REQUEST: 50,
  TOKEN_CACHE_TTL: 2400, // 40 minutes (safe margin before 60-min expiration)
  USER_ID: "21h6osgmy2twlu7ichm7ygfhq", // Jeff's Spotify user ID
} as const;

// Helper functions
const createAuthToken = (): string =>
  Buffer.from(
    `${SPOTIFY_CREDENTIALS.clientId}:${SPOTIFY_CREDENTIALS.clientSecret}`,
  ).toString("base64");

const createTokenRequestParams = (): URLSearchParams =>
  new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: SPOTIFY_CREDENTIALS.refreshToken,
  });

/**
 * Decodes HTML entities in text
 */
export const decodeHtmlEntities = (text: string): string => {
  return text
    .replace(/&#x([0-9A-Fa-f]+);/g, (match, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]*>/g, "");
};

const createTokenFetchOptions = (
  authToken: string,
  params: URLSearchParams,
  bypassCache: boolean,
): RequestInit => ({
  method: "POST",
  headers: {
    Authorization: `Basic ${authToken}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: params,
  ...(bypassCache
    ? { cache: "no-store" }
    : {
        next: {
          revalidate: SPOTIFY_API.TOKEN_CACHE_TTL,
          tags: ["spotify-token"],
        },
      }),
});

/**
 * Core token fetching logic (internal use only)
 */
const fetchAccessTokenCore = async (
  bypassCache: boolean = false,
): Promise<string> => {
  const authToken = createAuthToken();
  const params = createTokenRequestParams();
  const fetchOptions = createTokenFetchOptions(authToken, params, bypassCache);

  const response = await fetch(SPOTIFY_API.TOKEN_URL, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();

  if (bypassCache) {
    logger.log("Spotify", "Fetched fresh access token (bypassed cache)");
  }

  return data.access_token;
};

/**
 * Fetches a Spotify access token using the refresh token
 * Uses Next.js Data Cache with 40-minute TTL
 * Wrapped with React cache() to deduplicate requests within a single render
 */
export const getSpotifyAccessToken = cache(async (): Promise<string> => {
  try {
    return await fetchAccessTokenCore(false);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Spotify", `Failed to get access token: ${message}`);
    throw error;
  }
});

/**
 * Forces a fresh access token by bypassing cache
 * Used when a cached token has expired (401 error)
 */
export const getFreshSpotifyAccessToken = async (): Promise<string> => {
  try {
    return await fetchAccessTokenCore(true);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Spotify", `Failed to get fresh access token: ${message}`);
    throw error;
  }
};

/**
 * Extracts Spotify ID from a Spotify URL
 * @example extractSpotifyId("https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp?si=123") => "3n3Ppam7vgaVa1iaRUc9Lp"
 */
export const extractSpotifyId = (url: string): string | undefined => {
  return url.split("/").pop()?.split("?")[0];
};

/**
 * Generic safe fetch for Spotify API endpoints with error handling and logging
 */
export const safeFetchSpotify = async <T>(
  url: string,
  options: NextFetchOptions,
  logContext: string,
): Promise<T | null> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      logger.error(logContext, `HTTP ${response.status}`);
      return null;
    }
    const data = await response.json();
    return data.error ? null : (data as T);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(logContext, message);
    return null;
  }
};

/**
 * Empty playlists response (used as fallback)
 */
const EMPTY_PLAYLISTS: UserPlaylists = {
  items: [],
  total: 0,
  href: "",
  limit: 0,
  next: null,
  offset: 0,
  previous: null,
};

/**
 * Fetches user playlists from the Spotify API
 */
export const fetchPlaylists = async (
  limit: number = 50,
  offset: number = 0,
  includeGenres: boolean = false,
): Promise<UserPlaylists> => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/playlists?limit=${limit}&offset=${offset}&includeGenres=${includeGenres}`;

  const playlists = await safeFetchSpotify<UserPlaylists>(
    url,
    { next: { revalidate: 86400, tags: ["playlists"] } },
    "Fetch playlists",
  );

  if (playlists?.items) {
    logger.success("Spotify", `Fetched ${playlists.items.length} playlists`);
    return playlists;
  }

  return EMPTY_PLAYLISTS;
};
