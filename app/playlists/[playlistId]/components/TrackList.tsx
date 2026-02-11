"use client";

import { Music, Pause, Play } from "lucide-react";

import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { usePreviewPlayer } from "@/contexts/PreviewPlayerContext";
import { useYouTubeSearch } from "@/hooks/useYouTubeSearch";

import type { ArtistDetails, PlaylistTrack } from "@/types/spotify";

// Constants
const MAX_GENRES_PER_TRACK = 2;

// Helper function
const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

interface TrackListProps {
  tracks: PlaylistTrack[];
  artistMap: Record<string, ArtistDetails>;
}

export default function TrackList({ tracks, artistMap }: TrackListProps) {
  const { currentTrack, isPlaying: globalIsPlaying, togglePlayPause } = usePreviewPlayer();
  const { searchVideo } = useYouTubeSearch();

  const handlePlayClick = async (
    e: React.MouseEvent,
    track: PlaylistTrack["track"],
    trackGenres: string[],
  ) => {
    e.preventDefault();
    e.stopPropagation();

    // Search for YouTube video
    const artistName = track.artists[0]?.name || "";
    const youtubeVideoId = await searchVideo(track.name, artistName);

    togglePlayPause({
      id: track.id,
      name: track.name,
      artists: track.artists,
      album: track.album,
      spotifyUrl: track.external_urls.spotify,
      youtubeVideoId: youtubeVideoId || undefined,
      genres: trackGenres,
    });
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl text-gray-900 sm:text-2xl dark:text-white">
          Tracks
        </h2>
        <div className="space-y-2">
          {tracks.map((item, originalIndex) => {
            if (!item?.track) return null;

            const track = item.track;
            const trackGenres = track.artists
              .flatMap((artist) => {
                const artistData = artistMap[artist.id];
                return artistData?.genres || [];
              })
              .slice(0, MAX_GENRES_PER_TRACK);

            const isCurrentTrack = currentTrack?.id === track.id;
            const isPlaying = isCurrentTrack && globalIsPlaying;

            return (
              <div
                key={track.id}
                onClick={(e) => {
                  // Only handle if not clicking on a link
                  if ((e.target as HTMLElement).tagName !== 'A') {
                    handlePlayClick(e, track, trackGenres);
                  }
                }}
                className="group relative flex min-h-[72px] cursor-pointer items-center space-x-2 rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200 sm:min-h-[80px] sm:space-x-4 sm:p-4 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {/* Track Index */}
                <div
                  className={`flex w-6 shrink-0 items-center justify-center font-mono text-xs sm:w-8 sm:text-sm ${
                    isCurrentTrack
                      ? "text-[#3d38f5] dark:text-[#8b87ff]"
                      : "text-gray-500 dark:text-gray-500"
                  }`}
                >
                  {originalIndex + 1}
                </div>

                {/* Album Art with Play Button */}
                <div className="group/artwork relative h-10 w-10 shrink-0 overflow-hidden rounded bg-gray-200 sm:h-12 sm:w-12 dark:bg-white/5">
                  {track.album.images && track.album.images.length > 0 ? (
                    <ImageWithFallback
                      src={
                        track.album.images[track.album.images.length - 1].url
                      }
                      alt={track.album.name}
                      fill
                      sizes="(max-width: 640px) 40px, 48px"
                      className="object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Music className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Play Button Overlay */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayClick(e, track, trackGenres);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePlayClick(e as any, track, trackGenres);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`absolute inset-0 flex cursor-pointer items-center justify-center transition-all duration-200 hover:bg-black/40 ${
                      isCurrentTrack
                        ? "bg-black/40 opacity-100"
                        : "bg-black/20 opacity-0 group-hover:opacity-100 group-hover:bg-black/40 group-[.hovering-title]:opacity-0"
                    }`}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    <div className="rounded-full bg-white/90 p-1 backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 dark:bg-black/90">
                      {isPlaying ? (
                        <Pause className="h-2.5 w-2.5 fill-current text-gray-900 sm:h-3 sm:w-3 dark:text-white" />
                      ) : (
                        <Play className="h-2.5 w-2.5 fill-current text-gray-900 sm:h-3 sm:w-3 dark:text-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Track Info */}
                <div className="flex min-w-0 flex-1 items-center justify-between">
                  {/* Left: Song & Artist */}
                  <div className="min-w-0 shrink">
                    <a
                      href={track.external_urls.spotify}
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
                      className={`mb-0.5 block truncate text-sm font-medium transition-colors hover:underline sm:text-base ${
                        isCurrentTrack
                          ? "text-[#3d38f5] hover:text-[#5a56f7] dark:text-[#8b87ff] dark:hover:text-[#a6a3ff]"
                          : "text-gray-900 hover:text-[#3d38f5] dark:text-white dark:hover:text-[#8b87ff]"
                      }`}
                    >
                      {track.name}
                    </a>
                    <div className="truncate text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                      {track.artists.map((artist, idx) => {
                        const artistWithUrls = artist as typeof artist & { external_urls?: { spotify: string } };
                        return (
                          <span key={artist.id}>
                            {artistWithUrls.external_urls?.spotify ? (
                              <a
                                href={artistWithUrls.external_urls.spotify}
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
                                {artist.name}
                              </a>
                            ) : (
                              artist.name
                            )}
                            {idx < track.artists.length - 1 && ", "}
                          </span>
                        );
                      })}
                    </div>
                    {/* Mobile: genres dot-separated on third line */}
                    {trackGenres.length > 0 && (
                      <div className="mt-1 truncate text-xs text-gray-500 sm:hidden dark:text-gray-500">
                        {trackGenres.length > 0
                          ? trackGenres.join(" • ")
                          : "\u00A0"}
                      </div>
                    )}
                  </div>

                  {/* Right: Album & Genre chips (Desktop only) */}
                  <div className="ml-4 hidden max-w-[400px] shrink-0 items-center gap-3 sm:flex">
                    {(() => {
                      const albumWithUrls = track.album as typeof track.album & { 
                        external_urls?: { spotify: string }; 
                        id?: string;
                      };
                      return (
                        <a
                          href={albumWithUrls.external_urls?.spotify || (albumWithUrls.id ? `https://open.spotify.com/album/${albumWithUrls.id}` : '#')}
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
                          className="inline min-w-0 truncate text-xs text-gray-600 transition-colors hover:text-[#3d38f5] hover:underline sm:text-sm dark:text-gray-400 dark:hover:text-[#8b87ff]"
                        >
                          {track.album.name}
                        </a>
                      );
                    })()}
                    {trackGenres.length > 0 && (
                      <div className="flex shrink-0 items-center gap-1.5">
                        {trackGenres.map((genre, idx) => (
                          <span
                            key={idx}
                            className="whitespace-nowrap rounded-full bg-gray-300/50 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-400"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div className="shrink-0 font-mono text-xs text-gray-500 sm:text-sm dark:text-gray-500">
                  {formatDuration(track.duration_ms)}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
