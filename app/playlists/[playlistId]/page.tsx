import { cache } from "react";

import { notFound } from "next/navigation";

import PlaylistArtists from "@/components/Playlists/PlaylistArtists";
import PlaylistGenres from "@/components/Playlists/PlaylistGenres";

import { logger } from "@/utils/logger";
import {
  decodeHtmlEntities,
  getSpotifyAccessToken,
  SPOTIFY_API,
} from "@/utils/spotify";

import type {
  ArtistDetails,
  PlaylistDetails,
  PlaylistTrack,
} from "@/types/spotify";

import ErrorState from "./components/ErrorState";
import PlaylistHeader from "./components/PlaylistHeader";
import TrackList from "./components/TrackList";

// Constants
const MAX_ARTIST_IMAGE_INDEX = -1; // Use smallest image (last in array)

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

// Helper function
const formatTotalDuration = (ms: number): string => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return hours > 0 ? `${hours} hr ${minutes} min` : `${minutes} min`;
};

const calculateTotalDuration = (items: PlaylistTrack[]): number =>
  items
    .filter((item) => item.track)
    .reduce((sum, item) => sum + item.track.duration_ms, 0);

const getUniqueArtistIds = (items: PlaylistTrack[]): string[] =>
  Array.from(
    new Set(
      items
        .filter((item) => item.track)
        .flatMap((item) => item.track.artists.map((artist) => artist.id)),
    ),
  );

const calculateGenreStats = (
  items: PlaylistTrack[],
  artistMap: Record<string, ArtistDetails>,
  totalTracks: number,
) => {
  const genreCounts = new Map<string, Set<string>>();

  items
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

  return Array.from(genreCounts.entries())
    .map(([genre, trackIds]) => {
      const tracks = items
        .filter((item) => item.track && trackIds.has(item.track.id))
        .map((item) => item.track);

      return {
        genre,
        count: trackIds.size,
        percentage: Math.round((trackIds.size / totalTracks) * 100),
        tracks,
      };
    })
    .sort((a, b) => b.count - a.count);
};

const calculateArtistStats = (
  items: PlaylistTrack[],
  artistMap: Record<string, ArtistDetails>,
) => {
  const artistCounts = new Map<
    string,
    { id: string; name: string; songCount: number; image?: string }
  >();

  items
    .filter((item) => item.track)
    .forEach((item) => {
      item.track.artists.forEach((artist) => {
        const existing = artistCounts.get(artist.id);
        const artistData = artistMap[artist.id];
        const image =
          artistData?.images && artistData.images.length > 0
            ? artistData.images.at(MAX_ARTIST_IMAGE_INDEX)?.url
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

  return Array.from(artistCounts.values()).sort(
    (a, b) => b.songCount - a.songCount,
  );
};

// Fetch playlist details with Next.js cache
async function fetchPlaylistDetails(
  playlistId: string,
): Promise<PlaylistDetails> {
  try {
    const accessToken = await getSpotifyAccessToken();

    // Validate and clean playlist ID
    const cleanPlaylistId = decodeURIComponent(playlistId).trim();

    logger.log("Playlist Detail", `Fetching playlist: ${cleanPlaylistId}`);

    // Use fetch with aggressive caching for static playlist data
    const response = await fetch(
      `${SPOTIFY_API.BASE_URL}/playlists/${cleanPlaylistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: false, // Cache indefinitely
          tags: ["playlists", `playlist:${cleanPlaylistId}`],
        },
      },
    );

    if (!response.ok) {
      const error: any = new Error("Failed to fetch playlist");
      error.status = response.status;
      logger.error("Playlist Detail", `Failed: ${response.status}`);
      throw error;
    }

    const data = await response.json();
    logger.success(
      "Playlist Detail",
      `Fetched playlist with ${data.tracks.total} tracks`,
    );
    return data;
  } catch (error: any) {
    logger.error(
      "Playlist Detail",
      `Error fetching playlist ${playlistId}: ${error.status || ""} ${error.message}`,
    );

    if (error.status === 404 || error.response?.status === 404) {
      notFound();
    }

    if (error.status === 400 || error.response?.status === 400) {
      logger.error(
        "Playlist Detail",
        `Bad request - invalid playlist ID: ${playlistId}`,
      );
      notFound();
    }

    throw new Error("Failed to fetch playlist");
  }
}

// Use React cache() to deduplicate calls within same request (metadata + page render)
// The inner fetch already has Next.js data cache with revalidate
const getPlaylistDetails = cache(
  async (playlistId: string): Promise<PlaylistDetails> => {
    return fetchPlaylistDetails(playlistId);
  },
);

// Fetch artist details - returns plain object (not Map) for cache serialization
async function fetchArtistDetails(
  artistIds: string[],
): Promise<Record<string, ArtistDetails>> {
  if (artistIds.length === 0) return {};

  try {
    const accessToken = await getSpotifyAccessToken();
    logger.log("Playlist Detail", `Fetching ${artistIds.length} artists`);

    // Use our cached API endpoint with indefinite caching
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/artists/genres?artistIds=${artistIds.join(",")}`,
      {
        headers: {
          access_token: accessToken,
        },
        next: {
          revalidate: false, // Cache indefinitely
          tags: ["artist-genres"],
        },
      },
    );

    if (!response.ok) {
      logger.error(
        "Playlist Detail",
        `Failed to fetch artists: ${response.status} ${response.statusText}`,
      );
      throw new Error(`Failed to fetch artists: ${response.statusText}`);
    }

    const data = await response.json();
    const artistMap: Record<string, ArtistDetails> = {};

    data.artists.forEach((artist: ArtistDetails) => {
      if (artist) {
        artistMap[artist.id] = {
          id: artist.id,
          name: artist.name,
          genres: artist.genres || [],
          images: artist.images || [],
        };
      }
    });

    logger.success(
      "Playlist Detail",
      `Mapped ${Object.keys(artistMap).length} artists`,
    );
    return artistMap;
  } catch (error: any) {
    logger.error(
      "Playlist Detail",
      `Error fetching artist details: ${error.message}`,
    );
    return {};
  }
}

// Use React cache() to deduplicate calls within same request
// The inner fetch already has Next.js data cache
const getArtistDetails = cache(
  async (artistIds: string[]): Promise<Record<string, ArtistDetails>> => {
    return fetchArtistDetails(artistIds);
  },
);

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;

  // Fetch and prepare data
  let playlist: PlaylistDetails;
  let artistMap: Record<string, ArtistDetails>;
  let totalDuration: number;
  let genreStats: ReturnType<typeof calculateGenreStats>;
  let artistStats: ReturnType<typeof calculateArtistStats>;
  let decodedDescription: string;

  try {
    playlist = await getPlaylistDetails(playlistId);

    // Get unique artist IDs and fetch their details
    const artistIds = getUniqueArtistIds(playlist.tracks.items);
    artistMap = await getArtistDetails(artistIds);

    // Calculate statistics
    totalDuration = calculateTotalDuration(playlist.tracks.items);
    genreStats = calculateGenreStats(
      playlist.tracks.items,
      artistMap,
      playlist.tracks.total,
    );
    artistStats = calculateArtistStats(playlist.tracks.items, artistMap);

    // Decode HTML entities in description
    decodedDescription = playlist.description
      ? decodeHtmlEntities(playlist.description)
      : "";
  } catch (error: any) {
    logger.error("Playlist Detail", `Error loading playlist: ${error.message}`);
    return <ErrorState />;
  }

  // Render UI
  return (
    <main className="flex flex-col">
      <PlaylistHeader
        playlist={playlist}
        decodedDescription={decodedDescription}
        totalDuration={formatTotalDuration(totalDuration)}
      />

      {genreStats.length > 0 && <PlaylistGenres genreStats={genreStats} />}

      {artistStats.length > 0 && <PlaylistArtists artists={artistStats} />}

      <TrackList tracks={playlist.tracks.items} artistMap={artistMap} />
    </main>
  );
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
    logger.error(
      "Playlist Detail",
      `Error in generateMetadata: ${error.message}`,
    );
    return {
      title: "Playlist - Inside The Cranium",
      description: "Explore this playlist",
    };
  }
}
