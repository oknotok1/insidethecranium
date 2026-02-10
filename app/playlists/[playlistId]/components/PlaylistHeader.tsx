import { ArrowLeft, Clock, ExternalLink, Music, User } from "lucide-react";

import Link from "next/link";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";

import type { PlaylistDetails } from "@/types/spotify";

interface PlaylistHeaderProps {
  playlist: PlaylistDetails;
  decodedDescription: string;
  totalDuration: string;
}

export default function PlaylistHeader({
  playlist,
  decodedDescription,
  totalDuration,
}: PlaylistHeaderProps) {
  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/playlists"
          className="mb-6 inline-flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-gray-900 sm:mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Playlists</span>
        </Link>

        <div className="flex flex-col gap-6 sm:gap-8 md:flex-row">
          {/* Playlist Image */}
          <div className="relative mx-auto h-48 w-48 shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-56 sm:w-56 md:mx-0 md:h-64 md:w-64 dark:bg-white/5">
            {playlist.images && playlist.images.length > 0 ? (
              <ImageWithFallback
                src={playlist.images[0].url}
                alt={playlist.name}
                fill
                priority
                sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music className="h-24 w-24 text-gray-400 dark:text-gray-600" />
              </div>
            )}
          </div>

          {/* Playlist Info */}
          <div className="flex flex-1 flex-col justify-end">
            <div className="mb-2 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
              Playlist
            </div>
            <h1 className="mb-6 text-3xl leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
              {playlist.name}
            </h1>
            {decodedDescription && (
              <p className="mb-8 line-clamp-3 text-sm text-gray-700 sm:text-base dark:text-gray-300">
                {decodedDescription}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 sm:gap-4 sm:text-sm dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <a
                  href={playlist.owner.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-gray-900 dark:hover:text-white"
                >
                  {playlist.owner.display_name}
                </a>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-2">
                <Music className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{playlist.tracks.total} songs</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{totalDuration}</span>
              </div>
              {playlist.followers && playlist.followers.total > 0 && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center space-x-2">
                    <span>
                      {playlist.followers.total.toLocaleString()} followers
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Open in Spotify Button */}
            <div className="mt-6">
              <a
                href={playlist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 rounded-full bg-[#3d38f5] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2d28e5]"
              >
                <span>Open in Spotify</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
