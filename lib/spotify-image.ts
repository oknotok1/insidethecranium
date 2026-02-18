/**
 * Spotify CDN hostnames used for album/track artwork.
 * Keep in sync with next.config.mjs images.remotePatterns for Spotify.
 */
export const SPOTIFY_IMAGE_CDN_HOSTS = new Set([
  "image-cdn-fa.spotifycdn.com",
  "image-cdn-ak.spotifycdn.com",
  "i.scdn.co",
  "mosaic.scdn.co",
]);

export function isAllowedSpotifyImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === "https:" &&
      SPOTIFY_IMAGE_CDN_HOSTS.has(parsed.hostname)
    );
  } catch {
    return false;
  }
}
