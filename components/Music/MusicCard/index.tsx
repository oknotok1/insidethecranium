import { Play } from "lucide-react";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";

interface MusicCardProps {
  title: string;
  subtitle?: string;
  genres: string[];
  artwork?: string;
  onClick?: () => void;
  spotifyUrl?: string;
}

export default function MusicCard({
  title,
  subtitle,
  genres,
  artwork,
  onClick,
  spotifyUrl,
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

  const cardClasses =
    "group block rounded-lg overflow-hidden bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg";

  if (spotifyUrl) {
    return (
      <a
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={`${cardClasses} w-full text-left`}>
        {content}
      </button>
    );
  }

  return <div className={cardClasses}>{content}</div>;
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
        className="w-full h-full object-cover"
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
            className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
          >
            {genre}
          </span>
        ))}
      </div>
    </>
  );
};
