import type { NowPlayingTrack, Track } from "@/types/spotify";

/**
 * Format duration from milliseconds to mm:ss
 */
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * Extract and format song data for display
 */
export const extractSongData = (
  displayTrack: Track | undefined,
  isListening: boolean,
  nowPlayingTrack: NowPlayingTrack | null,
) => {
  const duration = displayTrack?.duration_ms
    ? formatDuration(displayTrack.duration_ms)
    : undefined;

  const progress =
    isListening && nowPlayingTrack?.progress_ms !== undefined
      ? formatDuration(nowPlayingTrack.progress_ms)
      : undefined;

  return {
    title: displayTrack?.name || "Unknown Track",
    artist: displayTrack?.artists?.[0]?.name || "Unknown Artist",
    album: displayTrack?.album?.name || "Unknown Album",
    albumArtwork: displayTrack?.album?.images?.[0]?.url,
    spotifyUrl: displayTrack?.id
      ? `https://open.spotify.com/track/${displayTrack.id}`
      : undefined,
    duration,
    progress,
  };
};
