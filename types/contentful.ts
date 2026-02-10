export interface FeaturedSong {
  name?: string;
  artist?: string;
  url: string;
}

export interface FeaturedMusicFields {
  featuredSongs?: FeaturedSong[];
}
