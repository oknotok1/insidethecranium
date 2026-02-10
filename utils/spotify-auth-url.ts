/**
 * Generate Spotify authorization URL with required scopes
 *
 * Required scopes:
 * - user-read-currently-playing: Get current playing track
 * - user-read-recently-played: Get recently played tracks
 * - user-read-playback-state: Get playback state
 * - user-top-read: Get user's top artists (for genres)
 */

// Constants
const SPOTIFY_AUTH_BASE_URL = "https://accounts.spotify.com/authorize";
const REQUIRED_SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
  "user-top-read",
];

// Helper functions
const buildAuthParams = (
  clientId: string,
  redirectUri: string,
  scopes: string,
): URLSearchParams =>
  new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes,
  });

export function getSpotifyAuthUrl(clientId: string, redirectUri: string) {
  const scopes = REQUIRED_SCOPES.join(" ");
  const params = buildAuthParams(clientId, redirectUri, scopes);
  return `${SPOTIFY_AUTH_BASE_URL}?${params.toString()}`;
}

// For quick reference in console
export function logAuthUrl() {
  const clientId = process.env.SPOTIFY_CLIENT_ID || "YOUR_CLIENT_ID";
  const redirectUri = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/auth/callback`
    : "http://127.0.0.1:3000/api/spotify/auth/callback";

  const url = getSpotifyAuthUrl(clientId, redirectUri);
  return url;
}
