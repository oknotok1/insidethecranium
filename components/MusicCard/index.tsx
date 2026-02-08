import { Play } from "lucide-react";
import { ImageWithFallback } from "@/figma/ImageWithFallback";

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
        <h3 className="mb-1 truncate text-gray-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
            {subtitle}
          </p>
        )}
        <Genres genres={genres} />
      </div>
    </>
  );

  const cardClasses =
    "group block rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 overflow-hidden";

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

const AlbumArtwork = ({ artwork, title }: { artwork?: string, title: string }) => (
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

const Genres = ({ genres }: { genres: string[] }) => (
  <div className="flex flex-wrap gap-x-1.5 gap-y-2 mt-2">
    {genres.map((genre, index) => (
      <span
        key={index}
        className="px-2 py-0.5 text-[10px] sm:text-xs rounded-full bg-gray-300 dark:bg-white/10 text-gray-700 dark:text-gray-300"
      >
        {genre}
      </span>
    ))}
  </div>
)