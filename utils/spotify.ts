/**
 * Spotify API Utilities
 */

import { cache } from "react";

import type {
  ArtistDetails,
  SpotifySearchResponse,
  UserPlaylists,
} from "@/types/spotify";

import { logger } from "./logger";
import { shouldRetryRateLimit, waitForRetry } from "./rateLimitHandler";

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
  // Validate credentials before attempting to fetch
  if (
    !SPOTIFY_CREDENTIALS.clientId ||
    !SPOTIFY_CREDENTIALS.clientSecret ||
    !SPOTIFY_CREDENTIALS.refreshToken
  ) {
    throw new Error(
      "Missing required Spotify credentials (CLIENT_ID, CLIENT_SECRET, or REFRESH_TOKEN)",
    );
  }

  const authToken = createAuthToken();
  const params = createTokenRequestParams();
  const fetchOptions = createTokenFetchOptions(authToken, params, bypassCache);

  const response = await fetch(SPOTIFY_API.TOKEN_URL, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Spotify API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("No access token in Spotify response");
  }

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
 * Fetch from Spotify API with automatic 401 & 429 retry logic
 * Automatically refreshes token on 401 and retries rate limits on 429
 */
export const fetchSpotifyWithRetry = async <T>(
  url: string,
  options: {
    accessToken: string;
    method?: string;
    body?: any;
    next?: NextFetchRequestConfig;
  },
  logContext: string,
): Promise<{ data: T | null; error?: string; status?: number }> => {
  let accessToken = options.accessToken;
  let tokenRetried = false;
  let retryCount = 0;
  const maxRetries = 3;

  // Build fetch options
  const buildFetchOptions = (token: string) => ({
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body && { "Content-Type": "application/json" }),
    },
    ...(options.body && { body: JSON.stringify(options.body) }),
    ...(options.next && { next: options.next }),
  });

  while (retryCount <= maxRetries) {
    try {
      let response = await fetch(url, buildFetchOptions(accessToken));

      // Handle 401 - Token expired, retry with fresh token (only once)
      if (response.status === 401 && !tokenRetried) {
        logger.warn(
          logContext,
          "Token expired, fetching fresh token and retrying",
        );
        try {
          accessToken = await getFreshSpotifyAccessToken();
          tokenRetried = true;
          continue; // Retry with fresh token
        } catch (tokenError) {
          logger.error(logContext, "Failed to refresh token");
          return {
            data: null,
            error: "Failed to refresh token",
            status: 401,
          };
        }
      }

      // Handle 429 - Rate limiting with retry
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get("retry-after");
        const retryAfterSeconds = parseInt(retryAfterHeader || "5");

        const result = shouldRetryRateLimit(
          retryAfterSeconds,
          retryCount,
          maxRetries,
        );

        if (!result.shouldRetry) {
          logger.error(logContext, result.message);
          return {
            data: null,
            error: "Rate limited",
            status: 429,
          };
        }

        logger.warn(logContext, result.message);
        await waitForRetry(result.retryAfter);
        retryCount++;
        continue; // Retry after waiting
      }

      // Handle other non-OK responses
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch {
          // Ignore JSON parse errors
        }
        logger.error(logContext, errorMessage);
        return {
          data: null,
          error: errorMessage,
          status: response.status,
        };
      }

      // 204 No Content (e.g. nothing currently playing) — no body to parse
      if (response.status === 204) return { data: null };

      // Success
      const data = await response.json();
      return { data: data as T };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(logContext, `Fetch error: ${message}`);

      // Don't retry on network errors if we've already tried
      if (retryCount >= maxRetries) {
        return {
          data: null,
          error: message,
          status: 500,
        };
      }

      retryCount++;
      // Small delay before retrying on network errors
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Should not reach here, but just in case
  return {
    data: null,
    error: "Max retries exceeded",
    status: 500,
  };
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
 * Fetches user playlists from our API endpoint
 */
export const fetchPlaylists = async (
  limit: number = 50,
  offset: number = 0,
  includeGenres: boolean = false,
): Promise<UserPlaylists> => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/playlists?limit=${limit}&offset=${offset}&includeGenres=${includeGenres}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400, tags: ["playlists"] },
    });

    if (!response.ok) {
      logger.error("Spotify", `Failed to fetch playlists: ${response.status}`);
      return EMPTY_PLAYLISTS;
    }

    const playlists = await response.json();

    if (playlists?.items) {
      logger.success("Spotify", `Fetched ${playlists.items.length} playlists`);
      return playlists;
    }

    return EMPTY_PLAYLISTS;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Spotify", `Error fetching playlists: ${message}`);
    return EMPTY_PLAYLISTS;
  }
};

/**
 * Searches for an artist on Spotify by name
 * @param artistName - The artist name to search for
 * @param limit - Maximum number of results (default: 1)
 * @returns Artist details including images, or null if not found
 */
export const searchSpotifyArtist = cache(
  async (
    artistName: string,
    limit: number = 1,
  ): Promise<ArtistDetails | null> => {
    try {
      const accessToken = await getSpotifyAccessToken();
      const encodedQuery = encodeURIComponent(artistName);
      const url = `${SPOTIFY_API.BASE_URL}/search?q=${encodedQuery}&type=artist&limit=${limit}`;

      const result = await fetchSpotifyWithRetry<SpotifySearchResponse>(
        url,
        {
          accessToken,
          next: {
            revalidate: 86400, // Cache for 24 hours
            tags: ["spotify-artist-search"],
          },
        },
        "Spotify Artist Search",
      );

      if (result.data?.artists?.items && result.data.artists.items.length > 0) {
        const artist = result.data.artists.items[0];
        logger.success(
          "Spotify",
          `Found artist: ${artist.name} (${artist.images.length} images)`,
        );
        return artist;
      }

      logger.warn("Spotify", `No artist found for: ${artistName}`);
      return null;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error("Spotify", `Error searching for artist: ${message}`);
      return null;
    }
  },
);
