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
 * 2. Default: Screenshot → Favicon → Globe
 *    - Screenshots: Full page preview (800x450px, 16:9, WebP @ 80% quality) via /api/screenshot proxy
 *    - Cached for 7 days (client) / 30 days (CDN) for optimal performance
 *    - Favicons: Google high-res (256px) as fallback
 * 3. Sites with `preferFavicon: true`: Favicon → Screenshot → Globe
 *    - Use for sites with excellent brand icons (Spotify, Reddit, Last.fm, etc.)
 *    - These sites have recognizable favicons that work better than screenshots
 * 4. Globe icon fallback - Always works if all external sources fail
 *
 * Sites marked with preferFavicon:
 * - Spotify, Reddit, SoundCloud, Last.fm, Chosic, RYM, Derrick Gee
 *
 * Screenshots are fetched server-side via Next.js API route to avoid CORS issues.
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
  preferFavicon?: boolean; // If true, tries favicon before screenshot (for high-quality brand icons)
}

/**
 * Recommended Sites Display Order
 *
 * This array defines the exact order that sites should appear in.
 * All helper functions (getFeaturedSites, getSitesByTag, etc.) will sort results
 * according to this order array, maintaining consistency across all views.
 *
 * To reorder sites: Simply rearrange the IDs in this array.
 * Sites not listed here will appear at the end in their original order.
 */
export const recommendedSitesOrder: RecommendedSite["id"][] = [
  "nts-radio",
  "reddit-spotify-playlists",
  "worldwide-fm",
  "chosic",
  "everynoise",
  "derrick-gee",
  "mixcloud",
  "poolsuite",
  "lastfm",
  "soundcloud",
  "spotify",
  "statsforspotify",
  "rateyourmusic",
  "receiptify",
  "musicmap",
  "gnoosic",
];

/**
 * Main data array - add new sites here
 * Each site should have a unique ID for database migration
 *
 * Note: The display order is controlled by recommendedSitesOrder array above.
 * The order of items in this array does not affect the display order.
 */
export const recommendedSites: RecommendedSite[] = [
  // ===== FEATURED SITES (shown on homepage) =====
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
    id: "reddit-spotify-playlists",
    name: "Particle Detector (Spotify)",
    description:
      "Massive collection of 14,000+ Spotify-created genre playlists. Perfect supplement to Every Noise at Once for discovering niche genres.",
    url: "https://www.reddit.com/r/spotify/comments/4r3r1c/massive_dump_of_spotify_created_playlists_14k/",
    tags: ["Discovery"],
    featured: true,
    preferFavicon: true,
  },
  {
    id: "chosic",
    name: "Chosic",
    description:
      "Free music discovery platform with tools for finding similar songs, analyzing playlists, and discovering music by mood, genre, or BPM.",
    url: "https://www.chosic.com",
    tags: ["Discovery", "Analytics"],
    featured: true,
    preferFavicon: true,
  },
  {
    id: "nts-radio",
    name: "NTS Radio",
    description:
      "Free, ad-free 24/7 online radio with live shows and extensive archive. Tune into cutting-edge music from around the world.",
    url: "https://www.nts.live/radio",
    tags: ["Streaming", "Community"],
    featured: true,
  },
  {
    id: "worldwide-fm",
    name: "Worldwide FM",
    description:
      "Global music radio platform founded by Gilles Peterson, connecting people through music that transcends borders and cultures.",
    url: "https://www.worldwidefm.net",
    tags: ["Streaming", "Community"],
    featured: true,
  },
  {
    id: "rateyourmusic",
    name: "RYM (Rate Your Music)",
    description:
      "Comprehensive music database and rating platform with active community discussions.",
    url: "https://rateyourmusic.com",
    tags: ["Community", "Discovery"],
    preferFavicon: true,
  },
  {
    id: "derrick-gee",
    name: "Derrick Gee",
    description:
      "Professional music fan and tastemaker. Weekly Solid Air show, curated playlists, and trusted insights spanning music, hi-fi, and culture.",
    url: "https://www.derrickgee.com",
    tags: ["Community", "Discovery"],
    featured: true,
    preferFavicon: true,
  },
  {
    id: "poolsuite",
    name: "Poolsuite FM",
    description:
      "Retro-inspired summer music radio experience with curated playlists and a nostalgic aesthetic.",
    url: "https://poolsuite.net",
    tags: ["Streaming"],
    featured: true,
    imageUrl: "https://poolsuite.net/og.png",
  },

  // ===== NON-FEATURED SITES =====
  {
    id: "spotify",
    name: "Spotify",
    description:
      "My primary music streaming platform with excellent playlist curation and discovery features.",
    url: "https://spotify.com",
    tags: ["Streaming", "Discovery"],
    preferFavicon: true,
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    description:
      "Platform for discovering emerging artists and underground music.",
    url: "https://soundcloud.com",
    tags: ["Streaming", "Discovery"],
    preferFavicon: true,
  },
  {
    id: "mixcloud",
    name: "Mixcloud",
    description:
      "Platform for DJ mixes, radio shows, and podcasts. Listen to curated sets from DJs and radio hosts worldwide.",
    url: "https://www.mixcloud.com",
    tags: ["Streaming", "Community"],
  },
  {
    id: "lastfm",
    name: "Last.fm",
    description:
      "Track your listening history and get personalized recommendations based on your scrobbling data.",
    url: "https://www.last.fm",
    tags: ["Analytics", "Discovery"],
    preferFavicon: true,
  },
  {
    id: "statsforspotify",
    name: "Stats for Spotify",
    description:
      "Detailed analytics about your Spotify listening habits, top artists, and tracks.",
    url: "https://www.statsforspotify.com",
    tags: ["Analytics"],
  },
  {
    id: "receiptify",
    name: "Receiptify",
    description:
      "Generate receipt-style images of your top Spotify tracks, artists, or albums. A fun way to visualize and share your music taste.",
    url: "https://receiptify.herokuapp.com/",
    tags: ["Analytics"],
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

// Sort sites according to the recommendedSitesOrder array
function sortSitesByOrder(sites: RecommendedSite[]): RecommendedSite[] {
  return [...sites].sort((a, b) => {
    const indexA = recommendedSitesOrder.indexOf(a.id);
    const indexB = recommendedSitesOrder.indexOf(b.id);

    // If both are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only A is in the order array, it comes first
    if (indexA !== -1) return -1;
    // If only B is in the order array, it comes first
    if (indexB !== -1) return 1;
    // If neither is in the order array, maintain original order
    return 0;
  });
}

export function getAllTags(): SiteTag[] {
  const allTags = recommendedSites.flatMap((site) => site.tags);
  return Array.from(new Set(allTags));
}

export function getSitesByTag(tag: SiteTag): RecommendedSite[] {
  return sortSitesByOrder(
    recommendedSites.filter((site) => site.tags.includes(tag)),
  );
}

export function getFeaturedSites(): RecommendedSite[] {
  return sortSitesByOrder(recommendedSites.filter((site) => site.featured));
}

export function getNonFeaturedSites(): RecommendedSite[] {
  return sortSitesByOrder(recommendedSites.filter((site) => !site.featured));
}

export function getAllSitesInOrder(): RecommendedSite[] {
  return sortSitesByOrder(recommendedSites);
}

export function getSiteById(id: string): RecommendedSite | undefined {
  return recommendedSites.find((site) => site.id === id);
}
