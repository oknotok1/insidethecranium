"use client";

import { Play } from "lucide-react";

import { useState } from "react";

import Image from "next/image";

import { useAppContext, type NowPlayingTrack } from "@/contexts/AppContext";

import styles from "./styles.module.scss";

type TrackItem = NonNullable<NowPlayingTrack["item"]>;

const BUTTON_GRADIENT = "bg-linear-to-r from-[#3d38f5] to-[#8b87ff]";
const RADIAL_GRADIENT_STYLE = {
  background:
    "radial-gradient(circle at 30% 50%, rgba(61, 56, 245, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(139, 135, 255, 0.12) 0%, transparent 50%)",
};

interface NowPlayingProps {
  className?: string;
}

// Helper component for track info text
const TrackText = ({
  text,
  className,
}: {
  text: string;
  className: string;
}) => <span className={className}>{text}</span>;

// Helper component for separator
const Separator = () => (
  <span className="mx-1.5 font-normal opacity-70">•</span>
);

export default function NowPlaying({ className }: NowPlayingProps) {
  const { nowPlayingTrack, nowPlayingGenres, isListening } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!nowPlayingTrack || !isListening || !nowPlayingTrack.item) return null;

  const track = nowPlayingTrack.item;
  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`${styles.nowPlaying} ${className || ""} relative`}>
        <button
          onClick={toggleOpen}
          className={`flex w-full min-w-0 cursor-pointer items-center space-x-2 rounded-full ${BUTTON_GRADIENT} px-3 py-1.5 text-xs text-white transition-all hover:scale-[1.02] hover:shadow-lg active:scale-100`}
          aria-label={`Now playing: ${track.name} by ${track.artists[0]?.name} from ${track.album?.name}`}
        >
          <Play className="h-3 w-3 shrink-0 fill-current" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="animate-marquee inline-block whitespace-nowrap">
              <TrackInfo track={track} />
              <TrackInfo track={track} />
            </div>
          </div>
        </button>

        {isOpen && (
          <Popover
            track={track}
            genres={nowPlayingGenres}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 top-16 z-60 bg-black/20 dark:bg-black/40"
          onClick={() => setIsOpen(false)}
          aria-label="Close popover"
        />
      )}
    </>
  );
}

// Component for displaying track info in marquee
const TrackInfo = ({ track }: { track: TrackItem }) => (
  <div className="inline-block">
    <TrackText text={track.name} className="font-semibold" />
    <Separator />
    <TrackText text={track.artists[0]?.name} className="font-normal" />
    <Separator />
    <TrackText text={track.album?.name} className="font-light italic" />
    <span className="mx-4" />
  </div>
);

// Popover component for expanded track details
const Popover = ({
  track,
  genres,
  onClose,
}: {
  track: TrackItem;
  genres: string[];
  onClose: () => void;
}) => (
  <div
    className="fixed top-18 left-1/2 z-70 w-64 -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl lg:absolute lg:top-full lg:left-1/2 lg:mt-2 lg:-translate-x-1/2 dark:border-white/10 dark:bg-gray-900"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Background gradient */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
      <div className="absolute inset-0" style={RADIAL_GRADIENT_STYLE} />
    </div>

    {/* Content */}
    <div className="relative p-5">
      <div className="mb-3 text-center text-xs text-gray-600 dark:text-gray-400">
        Now Playing
      </div>

      {track.album?.images[0]?.url && (
        <div className="mb-3 flex justify-center">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-300/50 bg-gray-200 shadow-xl dark:border-white/10 dark:bg-white/5">
            <Image
              src={track.album.images[0].url}
              alt={track.album.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="mb-3 text-center">
        <h3 className="mb-1 text-base font-medium text-gray-900 dark:text-white">
          {track.name}
        </h3>
        <p className="mb-1 text-xs text-gray-700 dark:text-gray-300">
          {track.artists[0]?.name}
        </p>
        <p className="text-xs text-gray-600 italic dark:text-gray-400">
          {track.album?.name}
        </p>
      </div>

      {genres.length > 0 && (
        <div className="mb-4 text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {genres.join(" • ")}
          </p>
        </div>
      )}

      {track.external_urls?.spotify && (
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center space-x-2 rounded-full border border-gray-300 bg-gray-900/10 px-4 py-2 text-xs transition-colors hover:bg-gray-900/20 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
        >
          <span>Listen on Spotify</span>
        </a>
      )}
    </div>
  </div>
);
