import { Music } from "lucide-react";

import { Card } from "@/components/common/Card";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

import type { Playlist } from "@/types/spotify";

const MAX_GENRES_DISPLAY = 2;
const GRADIENT_BG =
  "linear-gradient(135deg, rgba(61, 56, 245, 0.1) 0%, rgba(139, 135, 255, 0.05) 100%)";

export { default as PlaylistCardSkeleton } from "./Skeleton";

// Helper to format song count text
const formatSongCount = (count: number): string =>
  `${count} ${count === 1 ? "song" : "songs"}`;

export default function PlaylistCard({ playlist }: { playlist: Playlist }) {
  const genres = playlist.topGenres || [];
  const songCount = playlist.tracks.total;
  const imageUrl = playlist.images[0]?.url || "";
  const playlistUrl = `/playlists/${playlist.id}`;

  return (
    <Card as="link" href={playlistUrl} className="h-full">
      <div
        className="relative aspect-square overflow-hidden"
        style={{ background: GRADIENT_BG }}
      >
        <ImageWithFallback
          src={imageUrl}
          alt={playlist.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-102"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3">
          <h3 className="mb-1 line-clamp-1 text-base font-medium text-gray-900 sm:text-lg dark:text-white">
            {playlist.name}
          </h3>

          {playlist.description && (
            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {playlist.description}
            </p>
          )}
        </div>

        {genres.length > 0 && (
          <GenreDisplay genres={genres.slice(0, MAX_GENRES_DISPLAY)} />
        )}

        <div className="mt-auto flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Music className="h-4 w-4" />
          <span>{formatSongCount(songCount)}</span>
        </div>
      </div>
    </Card>
  );
}

// Genre display component
const GenreDisplay = ({ genres }: { genres: string[] }) => (
  <div className="mb-4">
    <div className="text-xs text-gray-600 sm:hidden dark:text-gray-400">
      {genres.join(" • ")}
    </div>

    <div className="hidden flex-wrap gap-2 sm:flex">
      {genres.map((genre) => (
        <span
          key={genre}
          className="rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-600 transition-colors group-hover:bg-gray-300 dark:bg-white/5 dark:text-gray-400 dark:group-hover:bg-white/10"
        >
          {genre}
        </span>
      ))}
    </div>
  </div>
);
