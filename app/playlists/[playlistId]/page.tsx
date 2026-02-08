import { cache } from 'react';
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Music, Clock, User, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "@/figma/ImageWithFallback";
import PlaylistGenres from "@/components/PlaylistGenres";
import PlaylistArtists from "@/components/PlaylistArtists";
import { logger } from "@/utils/logger";
import { SPOTIFY_API } from "@/utils/spotify";

// Cache playlist pages for 24 hours
export const revalidate = 86400;

// Render all other playlists on-demand (not at build time)
// This prevents cold start avalanche from building too many pages simultaneously
export const dynamicParams = true;

/**
 * Generate static params for only the first few playlists at build time
 * This prevents cold start issues while still providing good performance
 */
export async function generateStaticParams() {
  // Don't pre-render any playlists at build time to avoid cold start avalanche
  // All playlists will be rendered on-demand and cached for 24 hours
  return [];
  
  // Alternative: Pre-render only your top 3-5 playlists
  // return [
  //   { playlistId: 'your-top-playlist-id-1' },
  //   { playlistId: 'your-top-playlist-id-2' },
  // ];
}

interface PlaylistTrack {
  added_at: string;
  track: {
    id: string;
    name: string;
    duration_ms: number;
    external_urls: {
      spotify: string;
    };
    album: {
      name: string;
      images: Array<{
        url: string;
        height: number;
        width: number;
      }>;
    };
    artists: Array<{
      id: string;
      name: string;
      external_urls: {
        spotify: string;
      };
    }>;
  };
}

interface PlaylistDetails {
  id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
  };
  followers: {
    total: number;
  };
  tracks: {
    total: number;
    items: PlaylistTrack[];
  };
  external_urls: {
    spotify: string;
  };
  public: boolean;
}

interface ArtistDataAPI {
  id: string;
  name: string;
  genres: string[];
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

// Helper to get access token (inlined to avoid import issues with unstable_cache)
async function getAccessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  const token = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  if (SPOTIFY_REFRESH_TOKEN) {
    params.append('refresh_token', SPOTIFY_REFRESH_TOKEN);
  }

  const response = await fetch(SPOTIFY_API.TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
    next: {
      revalidate: 3000, // Cache for 50 minutes
      tags: ['spotify-token'],
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Fetch playlist details with Next.js unstable_cache to deduplicate across metadata + page render
async function fetchPlaylistDetails(playlistId: string): Promise<PlaylistDetails> {
  try {
    const accessToken = await getAccessToken();
    
    // Validate and clean playlist ID
    const cleanPlaylistId = decodeURIComponent(playlistId).trim();

    logger.log('Playlist Detail', `Fetching playlist: ${cleanPlaylistId}`);

    // Use fetch with aggressive caching for static playlist data
    const response = await fetch(
      `${SPOTIFY_API.BASE_URL}/playlists/${cleanPlaylistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: false, // Cache indefinitely
          tags: ['playlists', `playlist:${cleanPlaylistId}`]
        }
      }
    );

    if (!response.ok) {
      const error: any = new Error("Failed to fetch playlist");
      error.status = response.status;
      logger.error('Playlist Detail', `Failed: ${response.status}`);
      throw error;
    }

    const data = await response.json();
    logger.success('Playlist Detail', `Fetched playlist with ${data.tracks.total} tracks`);
    return data;
  } catch (error: any) {
    logger.error('Playlist Detail', `Error fetching playlist ${playlistId}: ${error.status || ''} ${error.message}`);

    if (error.status === 404 || error.response?.status === 404) {
      notFound();
    }

    if (error.status === 400 || error.response?.status === 400) {
      logger.error('Playlist Detail', `Bad request - invalid playlist ID: ${playlistId}`);
      notFound();
    }

    throw new Error("Failed to fetch playlist");
  }
}

// Use React cache() to deduplicate calls within same request (metadata + page render)
// The inner fetch already has Next.js data cache with revalidate
const getPlaylistDetails = cache(async (playlistId: string): Promise<PlaylistDetails> => {
  return fetchPlaylistDetails(playlistId);
});

// Fetch artist details - returns plain object (not Map) for cache serialization
async function fetchArtistDetails(
  artistIds: string[],
): Promise<Record<string, ArtistDataAPI>> {
  if (artistIds.length === 0) return {};

  try {
    const accessToken = await getAccessToken();
    logger.log('Playlist Detail', `Fetching ${artistIds.length} artists`);

    // Use our cached API endpoint with indefinite caching
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/artists/genres?artistIds=${artistIds.join(",")}`,
      {
        headers: {
          access_token: accessToken,
        },
        next: {
          revalidate: false, // Cache indefinitely
          tags: ['artist-genres']
        }
      }
    );

    if (!response.ok) {
      logger.error('Playlist Detail', `Failed to fetch artists: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch artists: ${response.statusText}`);
    }

    const data = await response.json();
    const artistMap: Record<string, ArtistDataAPI> = {};

    data.artists.forEach((artist: ArtistDataAPI) => {
      if (artist) {
        artistMap[artist.id] = {
          id: artist.id,
          name: artist.name,
          genres: artist.genres || [],
          images: artist.images || [],
        };
      }
    });

    logger.success('Playlist Detail', `Mapped ${Object.keys(artistMap).length} artists`);
    return artistMap;
  } catch (error: any) {
    logger.error('Playlist Detail', `Error fetching artist details: ${error.message}`);
    return {};
  }
}

// Use React cache() to deduplicate calls within same request
// The inner fetch already has Next.js data cache
const getArtistDetails = cache(async (artistIds: string[]): Promise<Record<string, ArtistDataAPI>> => {
  return fetchArtistDetails(artistIds);
});

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatTotalDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
}

function decodeHtmlEntities(text: string): string {
  const entities: { [key: string]: string } = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
  };
  return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
}

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;

  try {
    const playlist = await getPlaylistDetails(playlistId);

    // Get unique artist IDs from tracks
    const artistIds = Array.from(
      new Set(
        playlist.tracks.items
          .filter((item) => item.track)
          .flatMap((item) => item.track.artists.map((artist) => artist.id)),
      ),
    );

    // Fetch artist details including genres and images
    const artistMap = await getArtistDetails(artistIds);

    // Calculate total duration
    const totalDuration = playlist.tracks.items
      .filter((item) => item.track)
      .reduce((sum, item) => sum + item.track.duration_ms, 0);

    // Calculate genre statistics
    const genreCounts = new Map<string, Set<string>>();
    playlist.tracks.items
      .filter((item) => item.track)
      .forEach((item) => {
        item.track.artists.forEach((artist) => {
          const artistData = artistMap[artist.id];
          const genres = artistData?.genres || [];
          genres.forEach((genre) => {
            if (!genreCounts.has(genre)) {
              genreCounts.set(genre, new Set());
            }
            genreCounts.get(genre)!.add(item.track.id);
          });
        });
      });

    // Create genre stats with tracks
    const genreStats = Array.from(genreCounts.entries())
      .map(([genre, trackIds]) => {
        const tracks = playlist.tracks.items
          .filter((item) => item.track && trackIds.has(item.track.id))
          .map((item) => item.track);

        return {
          genre,
          count: trackIds.size,
          percentage: Math.round((trackIds.size / playlist.tracks.total) * 100),
          tracks,
        };
      })
      .sort((a, b) => b.count - a.count);

    // Calculate artist statistics with images
    const artistCounts = new Map<
      string,
      { id: string; name: string; songCount: number; image?: string }
    >();
    playlist.tracks.items
      .filter((item) => item.track)
      .forEach((item) => {
        item.track.artists.forEach((artist) => {
          const existing = artistCounts.get(artist.id);
          const artistData = artistMap[artist.id];
          const image =
            artistData?.images && artistData.images.length > 0
              ? artistData.images[artistData.images.length - 1].url
              : undefined;

          if (existing) {
            existing.songCount += 1;
          } else {
            artistCounts.set(artist.id, {
              id: artist.id,
              name: artist.name,
              songCount: 1,
              image,
            });
          }
        });
      });

    const artistStats = Array.from(artistCounts.values()).sort(
      (a, b) => b.songCount - a.songCount
    );

    // Decode HTML entities in description
    const decodedDescription = playlist.description
      ? decodeHtmlEntities(playlist.description)
      : "";

    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/playlists"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 sm:mb-8 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Playlists</span>
            </Link>

            <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
              {/* Playlist Image */}
              <div className="shrink-0 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto md:mx-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-white/5">
                {playlist.images && playlist.images.length > 0 ? (
                  <ImageWithFallback
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="w-24 h-24 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
              </div>

              {/* Playlist Info */}
              <div className="flex-1 flex flex-col justify-end">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Playlist
                </div>
                <h1 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900 dark:text-white">
                  {playlist.name}
                </h1>
                {decodedDescription && (
                  <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-700 dark:text-gray-300 line-clamp-3">
                    {decodedDescription}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <a
                      href={playlist.owner.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {playlist.owner.display_name}
                    </a>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center space-x-2">
                    <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{playlist.tracks.total} songs</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{formatTotalDuration(totalDuration)}</span>
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
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#3d38f5] hover:bg-[#2d28e5] text-white transition-colors text-sm font-medium"
                  >
                    <span>Open in Spotify</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Genres */}
        {genreStats.length > 0 && <PlaylistGenres genreStats={genreStats} />}

        {/* Artists */}
        {artistStats.length > 0 && <PlaylistArtists artists={artistStats} />}

        {/* Tracks */}
        <div className="pb-12 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl text-gray-900 dark:text-white">
              Tracks
            </h2>
            <div className="space-y-2">
              {playlist.tracks.items.map((item, originalIndex) => {
                if (!item?.track) return null;

                const track = item.track;
                const trackGenres = track.artists
                  .flatMap((artist) => {
                    const artistData = artistMap[artist.id];
                    return artistData?.genres || [];
                  })
                  .slice(0, 2);

                return (
                  <a
                    key={track.id}
                    href={track.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors min-h-[72px] sm:min-h-[80px]"
                  >
                    {/* Track Number */}
                    <div className="shrink-0 w-6 sm:w-8 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                      {originalIndex + 1}
                    </div>

                    {/* Album Art */}
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded overflow-hidden bg-gray-200 dark:bg-white/5">
                      {track.album.images && track.album.images.length > 0 ? (
                        <ImageWithFallback
                          src={track.album.images[track.album.images.length - 1].url}
                          alt={track.album.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      {/* Left: Song & Artist */}
                      <div className="min-w-0 shrink">
                        <div className="mb-0.5 text-sm sm:text-base font-medium truncate text-gray-900 dark:text-white">
                          {track.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {track.artists.map((artist) => artist.name).join(", ")}
                        </div>
                        {/* Mobile: genres dot-separated on third line */}
                        {trackGenres.length > 0 && (
                          <div className="sm:hidden text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                            {trackGenres.length > 0 ? trackGenres.join(" • ") : "\u00A0"}
                          </div>
                        )}
                      </div>

                      {/* Right: Album & Genre chips (Desktop only) */}
                      <div className="hidden sm:flex items-center gap-3 shrink-0 ml-4 max-w-[400px]">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate min-w-0">
                          {track.album.name}
                        </span>
                        {trackGenres.length > 0 && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {trackGenres.map((genre, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-xs rounded-full bg-gray-300/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 whitespace-nowrap"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="shrink-0 text-xs sm:text-sm text-gray-500 dark:text-gray-500 font-mono">
                      {formatDuration(track.duration_ms)}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    logger.error('Playlist Detail', `Error loading playlist: ${error.message}`);
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="mb-4 text-4xl text-gray-900 dark:text-white">
            Error Loading Playlist
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            There was a problem loading this playlist. Please try again later.
          </p>
          <Link
            href="/playlists"
            className="inline-flex items-center space-x-2 text-[#3d38f5] hover:text-[#2d28e5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Playlists</span>
          </Link>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;

  try {
    const playlist = await getPlaylistDetails(playlistId);

    return {
      title: `${playlist.name} - Inside The Cranium`,
      description: playlist.description
        ? decodeHtmlEntities(playlist.description)
        : `Listen to ${playlist.name} playlist`,
    };
  } catch (error: any) {
    logger.error('Playlist Detail', `Error in generateMetadata: ${error.message}`);
    return {
      title: "Playlist - Inside The Cranium",
      description: "Explore this playlist",
    };
  }
}
