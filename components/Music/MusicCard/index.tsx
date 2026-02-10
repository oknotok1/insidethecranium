import { Play } from "lucide-react";

import { Card } from "@/components/common/Card";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

const MAX_GENRES_DISPLAY = 3;

interface MusicCardProps {
  title: string;
  subtitle?: string;
  genres: string[];
  artwork?: string;
  onClick?: () => void;
  spotifyUrl?: string;
  className?: string;
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
}: MusicCardProps) {
  const content = (
    <>
      <AlbumArtwork artwork={artwork} title={title} />

      {/* Info */}
      <div className="p-4">
        {/* Title group */}
        <div className="mb-3">
          <h3 className="mb-1 truncate text-base font-medium text-gray-900 sm:text-lg dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="truncate text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* Metadata group */}
        <Genres genres={genres} />
      </div>
    </>
  );

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

  if (onClick) {
    return (
      <Card as="button" onClick={onClick} className={className}>
        {content}
      </Card>
    );
  }

  return <Card className={className}>{content}</Card>;
}

const AlbumArtwork = ({
  artwork,
  title,
}: {
  artwork?: string;
  title: string;
}) => (
  <div className="relative aspect-square overflow-hidden bg-gray-200 dark:bg-white/5">
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
            className="rounded-md bg-gray-200 px-2 py-1 text-xs text-gray-600 transition-colors group-hover:bg-gray-300 dark:bg-white/5 dark:text-gray-400 dark:group-hover:bg-white/10"
          >
            {genre}
          </span>
        ))}
      </div>
    </>
  );
};
