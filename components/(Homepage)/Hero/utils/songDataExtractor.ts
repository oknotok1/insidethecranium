// Helper function to format duration from milliseconds to mm:ss
export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

interface Track {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
}

interface NowPlayingTrack {
  item?: Track;
  progress_ms?: number;
  is_playing: boolean;
}

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
    title: displayTrack?.name || "No Recent Activity",
    artist: displayTrack?.artists?.[0]?.name || "Unknown Artist",
    album: displayTrack?.album?.name || "",
    albumArtwork: displayTrack?.album?.images?.[0]?.url,
    spotifyUrl: displayTrack?.id
      ? `https://open.spotify.com/track/${displayTrack.id}`
      : undefined,
    duration,
    progress,
  };
};
