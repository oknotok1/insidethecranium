import { Play } from "lucide-react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Card } from "@/components/common/Card";

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
          <h3 className="text-base sm:text-lg font-medium mb-1 truncate text-gray-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
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
      <Card as="anchor" href={spotifyUrl} target="_blank" rel="noopener noreferrer" className={className}>
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
  <div className="aspect-square relative overflow-hidden bg-gray-200 dark:bg-white/5">
    {artwork ? (
      <ImageWithFallback
        src={artwork}
        alt={`${title} artwork`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover group-hover:scale-102 transition-transform duration-300"
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <Play className="w-16 h-16 text-gray-400 dark:text-gray-600" />
      </div>
    )}
  </div>
);

const Genres = ({ genres }: { genres: string[] }) => {
  const displayGenres = genres.slice(0, 3);
  
  return (
    <>
      {/* Mobile: Dot-separated */}
      <div className="sm:hidden text-xs text-gray-600 dark:text-gray-400">
        {displayGenres.join(" • ")}
      </div>
      
      {/* Desktop: Chips */}
      <div className="hidden sm:flex flex-wrap gap-2">
        {displayGenres.map((genre, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded-md bg-gray-200 group-hover:bg-gray-300 dark:bg-white/5 dark:group-hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-colors"
          >
            {genre}
          </span>
        ))}
      </div>
    </>
  );
};
