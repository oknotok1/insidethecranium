import { Music } from "lucide-react";

import Link from "next/link";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";

import { Playlist } from "@/types/spotify";

/**
 * Legacy Playlist Card Design (Pre-2026 Style)
 *
 * This is the original playlist card design before the 2026 design system update.
 * Kept as a reference/backup in case we want to revert or reuse this style.
 *
 * Key differences from new design:
 * - Uses rounded-lg instead of rounded-2xl
 * - No border (just background color changes)
 * - No scale/shadow hover effects
 * - Simpler transition-colors vs transition-all
 */

interface LegacyPlaylistCardProps {
  playlist: Playlist;
}

export default function LegacyPlaylistCard({
  playlist,
}: LegacyPlaylistCardProps) {
  const genres = playlist.topGenres || [];
  const songCount = playlist.tracks.total;
  const imageUrl = playlist.images[0]?.url || "";
  const description = playlist.description;
  const playlistUrl = `/playlists/${playlist.id}`;

  return (
    <Link
      href={playlistUrl}
      className="group flex h-full flex-col self-start overflow-hidden rounded-lg bg-gray-100 transition-colors hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10"
    >
      <div
        className="relative aspect-square overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(61, 56, 245, 0.1) 0%, rgba(139, 135, 255, 0.05) 100%)",
        }}
      >
        <ImageWithFallback
          src={imageUrl}
          alt={playlist.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Title/Description group */}
        <div className="mb-3">
          <h3 className="mb-1 line-clamp-1 text-base font-medium text-gray-900 sm:text-lg dark:text-white">
            {playlist.name}
          </h3>

          {description && (
            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Genre metadata */}
        {genres.length > 0 && (
          <div className="mb-4">
            {/* Mobile: Dot-separated */}
            <div className="text-xs text-gray-600 sm:hidden dark:text-gray-400">
              {genres.slice(0, 2).join(" • ")}
            </div>

            {/* Desktop: Chips */}
            <div className="hidden flex-wrap gap-2 sm:flex">
              {genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full bg-gray-300 px-3 py-1.5 text-xs text-gray-700 dark:bg-white/5 dark:text-gray-400"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Song count - pushed to bottom */}
        <div className="mt-auto flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Music className="h-4 w-4" />
          <span>
            {songCount} {songCount === 1 ? "song" : "songs"}
          </span>
        </div>
      </div>
    </Link>
  );
}
