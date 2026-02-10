import { Music } from "lucide-react";

import { Item as SpotifyPlaylist } from "@/types/spotify";

import { Card } from "@/components/common/Card";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

interface PlaylistCardProps {
  playlist: SpotifyPlaylist;
}

export { default as PlaylistCardSkeleton } from "./Skeleton";

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const genres = playlist.topGenres || [];
  const songCount = playlist.tracks.total;
  const imageUrl = playlist.images[0]?.url || "";
  const description = playlist.description;
  const playlistUrl = `/playlists/${playlist.id}`;

  return (
    <Card as="link" href={playlistUrl} className="h-full">
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
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-102"
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
                  className="rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-600 transition-colors group-hover:bg-gray-300 dark:bg-white/5 dark:text-gray-400 dark:group-hover:bg-white/10"
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
    </Card>
  );
}
