import { Music } from "lucide-react";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";

import type { ArtistDetails, PlaylistTrack } from "@/types/spotify";

// Constants
const MAX_GENRES_PER_TRACK = 2;

// Helper function
const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

interface TrackListProps {
  tracks: PlaylistTrack[];
  artistMap: Record<string, ArtistDetails>;
}

export default function TrackList({ tracks, artistMap }: TrackListProps) {
  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl text-gray-900 sm:text-2xl dark:text-white">
          Tracks
        </h2>
        <div className="space-y-2">
          {tracks.map((item, originalIndex) => {
            if (!item?.track) return null;

            const track = item.track;
            const trackGenres = track.artists
              .flatMap((artist) => {
                const artistData = artistMap[artist.id];
                return artistData?.genres || [];
              })
              .slice(0, MAX_GENRES_PER_TRACK);

            return (
              <a
                key={track.id}
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[72px] items-center space-x-2 rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200 sm:min-h-[80px] sm:space-x-4 sm:p-4 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {/* Track Number */}
                <div className="w-6 shrink-0 text-center text-xs text-gray-400 sm:w-8 sm:text-sm dark:text-gray-500">
                  {originalIndex + 1}
                </div>

                {/* Album Art */}
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-200 sm:h-12 sm:w-12 dark:bg-white/5">
                  {track.album.images && track.album.images.length > 0 ? (
                    <ImageWithFallback
                      src={
                        track.album.images[track.album.images.length - 1].url
                      }
                      alt={track.album.name}
                      fill
                      sizes="(max-width: 640px) 40px, 48px"
                      className="object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Music className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="flex min-w-0 flex-1 items-center justify-between">
                  {/* Left: Song & Artist */}
                  <div className="min-w-0 shrink">
                    <div className="mb-0.5 truncate text-sm font-medium text-gray-900 sm:text-base dark:text-white">
                      {track.name}
                    </div>
                    <div className="truncate text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </div>
                    {/* Mobile: genres dot-separated on third line */}
                    {trackGenres.length > 0 && (
                      <div className="mt-1 truncate text-xs text-gray-500 sm:hidden dark:text-gray-500">
                        {trackGenres.length > 0
                          ? trackGenres.join(" • ")
                          : "\u00A0"}
                      </div>
                    )}
                  </div>

                  {/* Right: Album & Genre chips (Desktop only) */}
                  <div className="ml-4 hidden max-w-[400px] shrink-0 items-center gap-3 sm:flex">
                    <span className="min-w-0 truncate text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                      {track.album.name}
                    </span>
                    {trackGenres.length > 0 && (
                      <div className="flex shrink-0 items-center gap-1.5">
                        {trackGenres.map((genre, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-gray-300/50 px-2 py-0.5 text-xs whitespace-nowrap text-gray-600 dark:bg-white/5 dark:text-gray-400"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="shrink-0 font-mono text-xs text-gray-500 sm:text-sm dark:text-gray-500">
                  {formatDuration(track.duration_ms)}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
