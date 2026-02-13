// User Profile
interface UserProfile {
  display_name: string;
  external_urls: Record<string, string>;
  href: string;
  id: string;
  images: BasicImage[];
  type: string;
  uri: string;
  followers: Followers;
}

interface Followers {
  href: null;
  total: number;
}

// User Playlists
export interface UserPlaylists {
  href: string;
  limit: number;
  next: null;
  offset: number;
  previous: null;
  total: number;
  items: Playlist[];
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: Record<string, string>;
  href: string;
  id: string;
  images: BasicImage[];
  name: string;
  owner: Owner;
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
  topGenres?: string[]; // Top genres extracted from playlist artists
}

export interface Owner {
  display_name: string;
  external_urls: Record<string, string>;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Tracks {
  href: string;
  total: number;
}

// Image with dimensions (used for albums, artists, detailed playlists)
interface Image {
  url: string;
  height: number;
  width: number;
}

// Image without guaranteed dimensions (used for user profiles and basic playlists)
interface BasicImage {
  url: string;
  height: null;
  width: null;
}

// Album (base album object)
interface Album {
  name: string;
  images: Image[];
}

// Album with URI (used in Spotify Playback SDK)
interface AlbumWithUri extends Album {
  uri: string;
}

// Artist (base Spotify artist)
export interface Artist {
  id: string;
  name: string;
}

// Artist with full details (from Spotify API)
export interface ArtistDetails extends Artist {
  genres: string[];
  images: Image[];
}

// Artist aggregated for playlist view (with song count)
export interface PlaylistArtist extends Artist {
  songCount: number;
  image?: string;
}

// Track (standard Spotify track object)
export interface Track {
  id: string;
  name: string;
  artists: Artist[];
  album: Album;
  duration_ms: number;
  external_urls?: {
    spotify: string;
  };
  preview_url?: string | null; // 30-second MP3 preview URL
}

// Playlist Track (track with added_at timestamp)
export interface PlaylistTrack {
  added_at: string;
  track: Track & {
    external_urls: {
      spotify: string;
    };
    album: Album;
    artists: (Artist & {
      external_urls: {
        spotify: string;
      };
    })[];
  };
}

// Detailed Playlist (full playlist details from Spotify API)
export interface PlaylistDetails {
  id: string;
  name: string;
  description: string;
  images: Image[];
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

// Track with enriched genre data
export interface TrackWithGenres extends Track {
  genres: string[];
}

// Genre statistics for playlist analysis
export interface GenreStat {
  genre: string;
  count: number;
  percentage: number;
  tracks: Track[];
}

// Spotify Device
export interface SpotifyDevice {
  id: string;
  name: string;
  type: string;
}

// Spotify Web Playback SDK Player State
export interface SpotifyPlayerState {
  paused: boolean;
  position: number;
  duration: number;
  track_window: {
    current_track: {
      id: string;
      uri: string;
      name: string;
      duration_ms: number;
      artists: {
        name: string;
        uri: string;
      }[];
      album: AlbumWithUri;
    };
  };
}

// Now Playing Track (Spotify Web API response)
export interface NowPlayingTrack {
  item?: Track;
  progress_ms?: number;
  is_playing: boolean;
  timestamp?: number; // Unix timestamp in milliseconds
  device?: SpotifyDevice;
}

// Recently Played Track
export interface RecentlyPlayedItem {
  track: Track;
  played_at: string; // ISO 8601 timestamp
}

export interface RecentlyPlayedResponse {
  items?: RecentlyPlayedItem[];
}

// API Response Types
export interface TracksResponse {
  tracks: TrackWithGenres[];
}

// Next.js fetch options with revalidation
export interface NextFetchOptions extends RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}
