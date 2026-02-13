"use client";

import { Pause, Play } from "lucide-react";

import { Card } from "@/components/common/Card";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { usePreviewPlayer } from "@/contexts/PreviewPlayerContext";
import { useYouTubeSearch } from "@/hooks/useYouTubeSearch";

const MAX_GENRES_DISPLAY = 3;

interface MusicCardProps {
  title: string;
  subtitle?: string;
  genres: string[];
  artwork?: string;
  onClick?: () => void;
  spotifyUrl?: string;
  className?: string;
  // Preview player props
  trackId?: string;
  album?: string;
  artists?: { name: string; external_urls?: { spotify: string } }[];
}

export { default as MusicCardSkeleton } from "./Skeleton";

export default function MusicCard({
  title,
  subtitle,
  genres,
  artwork,
  onClick,
  spotifyUrl,
  className = "",
  trackId,
  album,
  artists,
}: MusicCardProps) {
  const { togglePlayPause, currentTrack, isPlaying: globalIsPlaying } = usePreviewPlayer();
  const { searchVideo } = useYouTubeSearch();

  const isCurrentTrack = currentTrack?.id === trackId;
  const isPlaying = isCurrentTrack && globalIsPlaying;
  const hasPreview = !!trackId && !!spotifyUrl; // Always true if we have track info

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!trackId) return;

    // Search for YouTube video and play
    (async () => {
      const artistName = artists?.[0]?.name || subtitle || "";
      const youtubeVideoId = await searchVideo(title, artistName);

      togglePlayPause({
        id: trackId,
        name: title,
        artists: artists || [{ name: subtitle || "" }],
        album: {
          name: album || "",
          images: artwork ? [{ url: artwork }] : [],
        },
        spotifyUrl: spotifyUrl || `https://open.spotify.com/track/${trackId}`,
        youtubeVideoId: youtubeVideoId || undefined,
        genres,
      });
    })();
  };

  const content = (
    <>
      <AlbumArtwork
        artwork={artwork}
        title={title}
        hasPreview={hasPreview}
        isPlaying={isPlaying}
        isCurrentTrack={isCurrentTrack}
        onPlayClick={handlePlayClick}
      />

      {/* Info */}
      <div className="p-4">
        {/* Title group */}
        <div className="mb-3">
          <div className="mb-1 truncate">
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={(e) => {
                // Hide play button when hovering song title
                const card = e.currentTarget.closest('.group');
                card?.classList.add('hovering-title');
              }}
              onMouseLeave={(e) => {
                // Show play button when leaving song title
                const card = e.currentTarget.closest('.group');
                card?.classList.remove('hovering-title');
              }}
              className="inline text-base font-medium text-gray-900 transition-colors hover:text-[#3d38f5] hover:underline sm:text-lg dark:text-white dark:hover:text-[#8b87ff]"
            >
              {title}
            </a>
          </div>
          {subtitle && (
            <div className="truncate text-sm text-gray-600 dark:text-gray-400">
              {artists?.[0]?.external_urls?.spotify ? (
                <a
                  href={artists[0].external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={(e) => {
                    const card = e.currentTarget.closest('.group');
                    card?.classList.add('hovering-title');
                  }}
                  onMouseLeave={(e) => {
                    const card = e.currentTarget.closest('.group');
                    card?.classList.remove('hovering-title');
                  }}
                  className="inline transition-colors hover:text-[#3d38f5] hover:underline dark:hover:text-[#8b87ff]"
                >
                  {subtitle}
                </a>
              ) : (
                subtitle
              )}
            </div>
          )}
        </div>

        {/* Metadata group */}
        <Genres genres={genres} />
      </div>
    </>
  );

  // Always use the card with play button if we have track info
  if (!trackId) {
    // Fallback: external link if no track ID or just a static card if no URL
    if (spotifyUrl) {
      return (
        <Card
          as="anchor"
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {content}
        </Card>
      );
    }
    return <Card className={className}>{content}</Card>;
  }

  // Wrapper to make entire card clickable for mini player
  const handleCardClick = async () => {
    if (!trackId) return;

    // Search for YouTube video
    const artistName = artists?.[0]?.name || subtitle || "";
    const youtubeVideoId = await searchVideo(title, artistName);

    togglePlayPause({
      id: trackId,
      name: title,
      artists: artists || [{ name: subtitle || "" }],
      album: {
        name: album || "",
        images: artwork ? [{ url: artwork }] : [],
      },
      spotifyUrl: spotifyUrl || `https://open.spotify.com/track/${trackId}`,
      youtubeVideoId: youtubeVideoId || undefined,
      genres,
    });
  };

  // Card with mini player functionality
  return (
    <Card
      as="button"
      onClick={handleCardClick}
      className={className}
    >
      {content}
    </Card>
  );
}

const AlbumArtwork = ({
  artwork,
  title,
  hasPreview,
  isPlaying,
  isCurrentTrack,
  onPlayClick,
}: {
  artwork?: string;
  title: string;
  hasPreview: boolean;
  isPlaying: boolean;
  isCurrentTrack: boolean;
  onPlayClick: (e: React.MouseEvent) => void;
}) => (
  <div className="group/artwork relative aspect-square overflow-hidden bg-gray-200 dark:bg-white/5">
    {artwork ? (
      <ImageWithFallback
        src={artwork}
        alt={`${title} artwork`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-102"
      />
    ) : (
      <div className="flex h-full w-full items-center justify-center">
        <Play className="h-16 w-16 text-gray-400 dark:text-gray-600" />
      </div>
    )}

    {/* Play Button Overlay - Show on mobile, hover on desktop, or when track is active */}
    {hasPreview && (
      <div
        onClick={onPlayClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onPlayClick?.(e as any);
          }
        }}
        role="button"
        tabIndex={0}
        className={`absolute inset-0 flex cursor-pointer items-center justify-center transition-all duration-200 hover:bg-black/40 ${
          isCurrentTrack
            ? "bg-black/40 opacity-100" // Always visible if active
            : "bg-black/20 lg:bg-black/0 lg:opacity-0 lg:group-hover:opacity-100 lg:group-hover:bg-black/40 lg:group-[.hovering-title]:opacity-0"
        }`}
        aria-label={isPlaying ? "Pause" : "Play preview"}
      >
        <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 sm:p-4 dark:bg-black/90">
          {isPlaying ? (
            <Pause className="h-6 w-6 fill-current text-gray-900 sm:h-8 sm:w-8 dark:text-white" />
          ) : (
            <Play className="h-6 w-6 fill-current text-gray-900 sm:h-8 sm:w-8 dark:text-white" />
          )}
        </div>
      </div>
    )}
  </div>
);

const Genres = ({ genres }: { genres: string[] }) => {
  const displayGenres = genres.slice(0, MAX_GENRES_DISPLAY);

  return (
    <>
      <div className="text-xs text-gray-600 sm:hidden dark:text-gray-400">
        {displayGenres.join(" • ")}
      </div>

      <div className="hidden flex-wrap gap-2 sm:flex">
        {displayGenres.map((genre, index) => (
          <span
            key={index}
            className="cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-600 transition-colors group-hover:bg-gray-300 dark:bg-white/5 dark:text-gray-400 dark:group-hover:bg-white/10"
          >
            {genre}
          </span>
        ))}
      </div>
    </>
  );
};
