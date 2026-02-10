import type {
  NowPlayingTrack,
  RecentlyPlayedResponse,
  Track,
} from "@/types/spotify";

/**
 * Extract the last played timestamp for a track
 * Returns ISO 8601 timestamp string or undefined
 */
export const extractLastPlayedTimestamp = (
  isListening: boolean,
  displayTrack: Track | undefined,
  nowPlayingTrack: NowPlayingTrack | null,
  recentlyPlayedTrack: RecentlyPlayedResponse | null,
): string | undefined => {
  // If currently listening, no "last played" timestamp
  if (isListening || !displayTrack) {
    return undefined;
  }

  // Check if showing recently played track
  const recentTrack = recentlyPlayedTrack?.items?.[0];
  if (recentTrack && displayTrack.id === recentTrack.track.id) {
    return recentTrack.played_at;
  }

  // Check if showing now playing track (just stopped)
  if (
    nowPlayingTrack?.item?.id === displayTrack.id &&
    nowPlayingTrack.timestamp
  ) {
    return new Date(nowPlayingTrack.timestamp).toISOString();
  }

  return undefined;
};
