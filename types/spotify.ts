// User Profile
export interface UserProfile {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  type: string;
  uri: string;
  followers: Followers;
}

export interface Followers {
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
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: ItemType;
  uri: string;
  topGenres?: string[]; // Top genres extracted from playlist artists
}

export interface Owner {
  display_name: DisplayName;
  external_urls: ExternalUrls;
  href: string;
  id: ID;
  type: OwnerType;
  uri: URI;
}

export interface Tracks {
  href: string;
  total: number;
}

export interface Image {
  height: null;
  url: string;
  width: null;
}

// Common Types
export interface StringMap {
  [key: string]: string;
}

export type ID = StringMap;
export type ExternalUrls = StringMap;
export type DisplayName = StringMap;
export type ItemType = StringMap;
export type OwnerType = StringMap;
export type URI = StringMap;

// Artist (base Spotify artist)
export interface Artist {
  id: string;
  name: string;
}

// Artist with full details (from Spotify API)
export interface ArtistDetails extends Artist {
  genres: string[];
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
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
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
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
    album: {
      name: string;
      images: Array<{
        url: string;
        height: number;
        width: number;
      }>;
    };
    artists: Array<
      Artist & {
        external_urls: {
          spotify: string;
        };
      }
    >;
  };
}

// Detailed Playlist (full playlist details from Spotify API)
export interface PlaylistDetails {
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
      artists: Array<{
        name: string;
        uri: string;
      }>;
      album: {
        name: string;
        uri: string;
        images: Array<{
          url: string;
        }>;
      };
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
