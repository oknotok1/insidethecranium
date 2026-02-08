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
  items: Item[];
}

export interface Item {
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
