"use client";

import { useState } from "react";
import Image from "next/image";

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
          className="flex w-full min-w-0 items-center space-x-2 rounded-full bg-linear-to-r from-[#3d38f5] to-[#8b87ff] px-3 py-1.5 text-xs text-white transition-all hover:scale-[1.02] hover:shadow-lg active:scale-100"
          aria-label={`Now playing: ${nowPlayingTrack?.item?.name} by ${nowPlayingTrack?.item?.artists[0]?.name} from ${nowPlayingTrack?.item?.album?.name}`}
          style={{ cursor: "pointer" }}
        >
          <Play className="h-3 w-3 shrink-0 fill-current" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="animate-marquee inline-block whitespace-nowrap">
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
            className="fixed top-18 left-1/2 z-70 w-64 -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl lg:absolute lg:top-full lg:left-1/2 lg:mt-2 lg:-translate-x-1/2 dark:border-white/10 dark:bg-gray-900"
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
              <div className="mb-3 text-center text-xs text-gray-600 dark:text-gray-400">
                Now Playing
              </div>

              {/* Album Artwork */}
              {nowPlayingTrack?.item?.album?.images[0]?.url && (
                <div className="mb-3 flex justify-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-300/50 bg-gray-200 shadow-xl dark:border-white/10 dark:bg-white/5">
                    <Image
                      src={nowPlayingTrack?.item?.album?.images[0]?.url}
                      alt={nowPlayingTrack?.item?.album?.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Song Info */}
              <div className="mb-3 text-center">
                <h3 className="mb-1 text-base font-medium text-gray-900 dark:text-white">
                  {nowPlayingTrack?.item?.name}
                </h3>
                <p className="mb-1 text-xs text-gray-700 dark:text-gray-300">
                  {nowPlayingTrack?.item?.artists[0]?.name}
                </p>
                <p className="text-xs text-gray-600 italic dark:text-gray-400">
                  {nowPlayingTrack?.item?.album?.name}
                </p>
              </div>

              {/* Genre */}
              {nowPlayingGenres.length > 0 && (
                <div className="mb-4 text-center">
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
                  className="flex w-full items-center justify-center space-x-2 rounded-full border border-gray-300 bg-gray-900/10 px-4 py-2 text-xs transition-colors hover:bg-gray-900/20 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20"
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
