"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import styles from "./styles.module.scss";

interface NowPlayingProps {
  className?: string;
}

export default function NowPlaying({ className }: NowPlayingProps) {
  const { nowPlayingTrack, nowPlayingGenres, isListening } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  // Only show if actively listening
  if (!nowPlayingTrack || !isListening || !nowPlayingTrack.item) return null;

  return (
    <>
      <div className={`${styles.nowPlaying} ${className || ""} relative`}>
        {/* Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-linear-to-r from-[#3d38f5] to-[#8b87ff] text-white text-xs transition-all hover:shadow-lg hover:scale-[1.02] active:scale-100 w-full min-w-0"
          aria-label="Now playing"
          style={{ cursor: "pointer" }}
        >
          <Play className="w-3 h-3 fill-current shrink-0" />
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="whitespace-nowrap inline-block animate-marquee">
              <div className="inline-block">
                <span className="font-semibold">
                  {nowPlayingTrack?.item?.name}
                </span>
                <span className="mx-1.5 font-normal opacity-70">•</span>
                <span className="font-normal">
                  {nowPlayingTrack?.item?.artists[0]?.name}
                </span>
                <span className="mx-1.5 font-normal opacity-70">•</span>
                <span className="font-light italic">
                  {nowPlayingTrack?.item?.album?.name}
                </span>
                <span className="mx-4"></span>
              </div>
              <div className="inline-block">
                <span className="font-semibold">
                  {nowPlayingTrack?.item?.name}
                </span>
                <span className="mx-1.5 font-normal opacity-70">•</span>
                <span className="font-normal">
                  {nowPlayingTrack?.item?.artists[0]?.name}
                </span>
                <span className="mx-1.5 font-normal opacity-70">•</span>
                <span className="font-light italic">
                  {nowPlayingTrack?.item?.album?.name}
                </span>
                <span className="mx-4"></span>
              </div>
            </div>
          </div>
        </button>

        {/* Popover - child of wrapper for proper positioning */}
        {isOpen && (
          <div
            className="fixed left-1/2 -translate-x-1/2 top-[4.5rem] lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-full lg:mt-2 w-64 rounded-xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 z-70 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background gradient */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 30% 50%, rgba(61, 56, 245, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(139, 135, 255, 0.12) 0%, transparent 50%)",
                }}
              />
            </div>

            {/* Content */}
            <div className="relative p-5">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center">
                Now Playing
              </div>

              {/* Album Artwork */}
              {nowPlayingTrack?.item?.album?.images[0]?.url && (
                <div className="flex justify-center mb-3">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 dark:bg-white/5 shadow-xl border border-gray-300/50 dark:border-white/10">
                    <img
                      src={nowPlayingTrack?.item?.album?.images[0]?.url}
                      alt={nowPlayingTrack?.item?.album?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Song Info */}
              <div className="text-center mb-3">
                <h3 className="text-base font-medium mb-1 text-gray-900 dark:text-white">
                  {nowPlayingTrack?.item?.name}
                </h3>
                <p className="text-xs mb-1 text-gray-700 dark:text-gray-300">
                  {nowPlayingTrack?.item?.artists[0]?.name}
                </p>
                <p className="text-xs italic text-gray-600 dark:text-gray-400">
                  {nowPlayingTrack?.item?.album?.name}
                </p>
              </div>

              {/* Genre */}
              {nowPlayingGenres.length > 0 && (
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {nowPlayingGenres.join(" • ")}
                  </p>
                </div>
              )}

              {/* Spotify Link */}
              {nowPlayingTrack?.item?.external_urls?.spotify && (
                <a
                  href={nowPlayingTrack?.item?.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-full bg-gray-900/10 hover:bg-gray-900/20 dark:bg-white/10 dark:hover:bg-white/20 border border-gray-300 dark:border-white/20 transition-colors text-xs"
                >
                  <span>Listen on Spotify</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop - rendered outside for proper click handling */}
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
