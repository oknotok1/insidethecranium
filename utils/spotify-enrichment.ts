/**
 * Spotify Artist Enrichment Utilities
 * 
 * Helper functions to enrich concert/show data with Spotify artist information
 */

import { searchSpotifyArtist } from "./spotify";

/**
 * Enriches a concert with Spotify artist image
 * @param concert - Concert to enrich
 * @returns Concert with artistImage field
 */
export const enrichConcertWithArtistImage = async <T extends { artistBand: string }>(
  concert: T
): Promise<T & { artistImage: string | null }> => {
  const artist = await searchSpotifyArtist(concert.artistBand);
  return {
    ...concert,
    artistImage: artist?.images?.[0]?.url || null,
  };
};

/**
 * Enriches a concert with Spotify artist URL
 * @param concert - Concert to enrich
 * @returns Concert with artistSpotifyUrl field
 */
export const enrichConcertWithArtistUrl = async <T extends { artistBand: string }>(
  concert: T
): Promise<T & { artistSpotifyUrl: string | null }> => {
  const artist = await searchSpotifyArtist(concert.artistBand);
  return {
    ...concert,
    artistSpotifyUrl: artist?.external_urls?.spotify || null,
  };
};

/**
 * Enriches an array of concerts with Spotify artist images in parallel
 * @param concerts - Array of concerts to enrich
 * @returns Array of concerts with artistImage field
 */
export const enrichConcertsWithArtistImages = async <T extends { artistBand: string }>(
  concerts: T[]
): Promise<Array<T & { artistImage: string | null }>> => {
  return Promise.all(concerts.map(enrichConcertWithArtistImage));
};

/**
 * Enriches an array of concerts with Spotify artist URLs in parallel
 * @param concerts - Array of concerts to enrich
 * @returns Array of concerts with artistSpotifyUrl field
 */
export const enrichConcertsWithArtistUrls = async <T extends { artistBand: string }>(
  concerts: T[]
): Promise<Array<T & { artistSpotifyUrl: string | null }>> => {
  return Promise.all(concerts.map(enrichConcertWithArtistUrl));
};
