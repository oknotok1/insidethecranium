import { Item as SpotifyPlaylist } from "@/types/spotify";
import { Music } from "lucide-react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Card } from "@/components/common/Card";

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
        className="aspect-square relative overflow-hidden"
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
          className="object-cover group-hover:scale-102 transition-transform duration-300"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        {/* Title/Description group */}
        <div className="mb-3">
          <h3 className="text-base sm:text-lg font-medium mb-1 line-clamp-1 text-gray-900 dark:text-white">
            {playlist.name}
          </h3>

          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Genre metadata */}
        {genres.length > 0 && (
          <div className="mb-4">
            {/* Mobile: Dot-separated */}
            <div className="sm:hidden text-xs text-gray-600 dark:text-gray-400">
              {genres.slice(0, 2).join(" • ")}
            </div>
            
            {/* Desktop: Chips */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Song count - pushed to bottom */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-auto">
          <Music className="w-4 h-4" />
          <span>
            {songCount} {songCount === 1 ? "song" : "songs"}
          </span>
        </div>
      </div>
    </Card>
  );
}
