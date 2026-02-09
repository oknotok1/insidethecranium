/**
 * Recommended Sites Data
 *
 * This file contains the curated list of music-related sites and platforms.
 * Structure is designed to be easily migrated to a database table.
 *
 * Database Schema (for future migration):
 * - id: string (primary key)
 * - name: string
 * - description: string
 * - url: string
 * - tags: string[] (stored as JSON array or separate junction table)
 * - featured: boolean
 * - image_url: string (optional - custom override, otherwise auto-fetches)
 * - created_at: timestamp
 * - updated_at: timestamp
 *
 * Image Fetching Strategy (Priority Order):
 * 1. Custom imageUrl (if provided) - Manual override for specific branding
 * 2. Google high-res favicon (256px) - Clean, recognizable site icons (most reliable)
 * 3. DuckDuckGo favicon - Alternative favicon source
 * 4. Microlink screenshot API - Full page screenshot (fallback if favicons fail)
 * 5. Globe icon fallback - Always works if all external sources fail
 * 
 * The system automatically cascades through these sources on error, ensuring
 * every site has a visual representation even if preferred sources fail.
 */

export type SiteTag =
  | "Discovery"
  | "Streaming"
  | "Analytics"
  | "Community"
  | "Artist Tools"
  | "Music News";

export interface RecommendedSite {
  id: string;
  name: string;
  description: string;
  url: string;
  tags: SiteTag[]; // Sites can have multiple tags
  featured?: boolean;
  imageUrl?: string; // Optional: for future use with site logos/screenshots
}

/**
 * Main data array - add new sites here
 * Each site should have a unique ID for database migration
 */
export const recommendedSites: RecommendedSite[] = [
  // Discovery
  {
    id: "everynoise",
    name: "Every Noise at Once",
    description:
      "An amazing visualization of music genres and their relationships. Discover new genres and artists through an interactive scatter plot.",
    url: "https://everynoise.com",
    tags: ["Discovery"],
    featured: true,
  },
  {
    id: "musicmap",
    name: "Music-Map",
    description:
      "Visual map of musical artists and their connections based on similarity.",
    url: "https://www.music-map.com",
    tags: ["Discovery"],
  },
  {
    id: "gnoosic",
    name: "Gnoosic",
    description:
      "Music recommendation engine that helps you discover artists similar to your favorites.",
    url: "https://www.gnoosic.com",
    tags: ["Discovery"],
  },
  {
    id: "reddit-spotify-playlists",
    name: "Spotify Genre Playlists (Reddit)",
    description:
      "Massive collection of 14,000+ Spotify-created genre playlists. Perfect supplement to Every Noise at Once for discovering niche genres.",
    url: "https://www.reddit.com/r/spotify/comments/4r3r1c/massive_dump_of_spotify_created_playlists_14k/",
    tags: ["Discovery"],
  },
  {
    id: "chosic",
    name: "Chosic",
    description:
      "Free music discovery platform with tools for finding similar songs, analyzing playlists, and discovering music by mood, genre, or BPM.",
    url: "https://www.chosic.com",
    tags: ["Discovery", "Analytics"],
    featured: true,
  },

  // Streaming
  {
    id: "spotify",
    name: "Spotify",
    description:
      "My primary music streaming platform with excellent playlist curation and discovery features.",
    url: "https://spotify.com",
    tags: ["Streaming", "Discovery"],
    featured: true,
    imageUrl: "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png",
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    description:
      "Platform for discovering emerging artists and underground music.",
    url: "https://soundcloud.com",
    tags: ["Streaming", "Discovery"],
    imageUrl: "https://developers.soundcloud.com/assets/logo_big_white-1e8e4f4d.png",
  },
  {
    id: "nts-radio",
    name: "NTS Radio",
    description:
      "Free, ad-free 24/7 online radio with live shows and extensive archive. Tune into cutting-edge music from around the world.",
    url: "https://www.nts.live/radio",
    tags: ["Streaming", "Community"],
    featured: true,
    imageUrl: "https://assets-global.website-files.com/5c7fdbdd4e3feeee8dd96dd2/6123a91c9e41ab0b45698e35_NTS_LOGO-p-500.png",
  },
  {
    id: "mixcloud",
    name: "Mixcloud",
    description:
      "Platform for DJ mixes, radio shows, and podcasts. Listen to curated sets from DJs and radio hosts worldwide.",
    url: "https://www.mixcloud.com",
    tags: ["Streaming", "Community"],
    imageUrl: "https://www.mixcloud.com/media/images/www/global/mixcloud-og.jpg",
  },
  {
    id: "worldwide-fm",
    name: "Worldwide FM",
    description:
      "Global music radio platform founded by Gilles Peterson, connecting people through music that transcends borders and cultures.",
    url: "https://www.worldwidefm.net",
    tags: ["Streaming", "Community"],
    featured: true,
    imageUrl: "https://assets-global.website-files.com/5e8e8f49d3c8a8e34e23a951/5e8eb504dba4d9656e0b1b2f_WWFM%20Logo%20Horizontal.png",
  },
  {
    id: "poolsuite",
    name: "Poolsuite FM",
    description:
      "Retro-inspired summer music radio experience with curated playlists and a nostalgic aesthetic.",
    url: "https://poolsuite.net",
    tags: ["Streaming"],
    imageUrl: "https://poolsuite.net/og.png",
  },

  // Analytics
  {
    id: "lastfm",
    name: "Last.fm",
    description:
      "Track your listening history and get personalized recommendations based on your scrobbling data.",
    url: "https://www.last.fm",
    tags: ["Analytics", "Discovery"],
    featured: true,
    imageUrl: "https://www.last.fm/static/images/lastfm_logo_facebook.15db3f5233d7.png",
  },
  {
    id: "statsforspotify",
    name: "Stats for Spotify",
    description:
      "Detailed analytics about your Spotify listening habits, top artists, and tracks.",
    url: "https://www.statsforspotify.com",
    tags: ["Analytics"],
    imageUrl: "https://www.statsforspotify.com/images/og-image.png",
  },
  {
    id: "receiptify",
    name: "Receiptify",
    description:
      "Generate receipt-style images of your top Spotify tracks, artists, or albums. A fun way to visualize and share your music taste.",
    url: "https://receiptify.herokuapp.com/",
    tags: ["Analytics"],
  },

  // Community
  {
    id: "rateyourmusic",
    name: "RYM (Rate Your Music)",
    description:
      "Comprehensive music database and rating platform with active community discussions.",
    url: "https://rateyourmusic.com",
    tags: ["Community", "Discovery"],
    featured: true,
  },
  {
    id: "derrick-gee",
    name: "Derrick Gee",
    description:
      "Professional music fan and tastemaker. Weekly Solid Air show, curated playlists, and trusted insights spanning music, hi-fi, and culture.",
    url: "https://www.derrickgee.com",
    tags: ["Community", "Discovery"],
    featured: true,
  },

  // Commented out for now - may add later
  // {
  //   id: "bandcamp",
  //   name: "Bandcamp",
  //   description:
  //     "Support artists directly and discover unique independent music.",
  //   url: "https://bandcamp.com",
  //   tags: ["Streaming", "Discovery"],
  // },
  // {
  //   id: "discogs",
  //   name: "Discogs",
  //   description:
  //     "The largest database of music releases with detailed discographies and marketplace.",
  //   url: "https://www.discogs.com",
  //   tags: ["Artist Tools", "Community"],
  // },
  // {
  //   id: "musicbrainz",
  //   name: "MusicBrainz",
  //   description:
  //     "Open music encyclopedia that collects music metadata and makes it available to the public.",
  //   url: "https://musicbrainz.org",
  //   tags: ["Artist Tools"],
  // },
  // {
  //   id: "pitchfork",
  //   name: "Pitchfork",
  //   description:
  //     "Music publication with reviews, news, and features covering all genres.",
  //   url: "https://pitchfork.com",
  //   tags: ["Music News"],
  // },
  // {
  //   id: "stereogum",
  //   name: "Stereogum",
  //   description:
  //     "Music blog covering indie, alternative, and mainstream music news and reviews.",
  //   url: "https://www.stereogum.com",
  //   tags: ["Music News"],
  // },
];

/**
 * Helper functions for data access
 * These will be useful when migrating to database queries
 */

export function getAllTags(): SiteTag[] {
  const allTags = recommendedSites.flatMap((site) => site.tags);
  return Array.from(new Set(allTags));
}

export function getSitesByTag(tag: SiteTag): RecommendedSite[] {
  return recommendedSites.filter((site) => site.tags.includes(tag));
}

export function getFeaturedSites(): RecommendedSite[] {
  return recommendedSites.filter((site) => site.featured);
}

export function getSiteById(id: string): RecommendedSite | undefined {
  return recommendedSites.find((site) => site.id === id);
}
