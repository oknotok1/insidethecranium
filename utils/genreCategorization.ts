/**
 * Genre Categorization Utility
 *
 * Spotify returns very specific genres (e.g., "indie rock", "modern rock", "alternative rock")
 * This utility helps categorize them into broader main genres for better analysis.
 */

// Constants
const DOMINANT_GENRE_THRESHOLD = 60; // percentage
const CLOSE_GENRE_DIFFERENCE_THRESHOLD = 15; // percentage
const COMBINED_GENRE_THRESHOLD = 50; // percentage
const MAX_DETECTED_GENRES = 3;

export interface GenreCategory {
  mainGenre: string;
  keywords: string[];
}

// Define main genre categories with their identifying keywords
export const GENRE_CATEGORIES: GenreCategory[] = [
  {
    mainGenre: "Rock",
    keywords: [
      "rock",
      "metal",
      "punk",
      "grunge",
      "alternative",
      "indie rock",
      "hard rock",
      "classic rock",
      "garage",
    ],
  },
  {
    mainGenre: "Pop",
    keywords: [
      "pop",
      "electropop",
      "synth-pop",
      "dance pop",
      "indie pop",
      "mainstream",
      "top 40",
      "chart",
    ],
  },
  {
    mainGenre: "Hip Hop",
    keywords: [
      "hip hop",
      "rap",
      "trap",
      "drill",
      "grime",
      "hip-hop",
      "rapper",
      "bars",
    ],
  },
  {
    mainGenre: "R&B",
    keywords: [
      "r&b",
      "rnb",
      "soul",
      "neo soul",
      "contemporary r&b",
      "r & b",
      "soulful",
      "motown",
    ],
  },
  {
    mainGenre: "Electronic",
    keywords: [
      "electronic",
      "edm",
      "house",
      "techno",
      "trance",
      "dubstep",
      "drum and bass",
      "dnb",
      "ambient",
      "idm",
      "synth",
      "electro",
      "dance",
      "club",
      "rave",
      "chill",
      "lofi",
      "lo-fi",
    ],
  },
  {
    mainGenre: "Jazz",
    keywords: [
      "jazz",
      "bebop",
      "swing",
      "fusion",
      "smooth jazz",
      "saxophone",
      "trumpet",
    ],
  },
  {
    mainGenre: "Classical",
    keywords: [
      "classical",
      "orchestra",
      "baroque",
      "romantic",
      "contemporary classical",
      "symphony",
      "piano",
      "violin",
    ],
  },
  {
    mainGenre: "Country",
    keywords: [
      "country",
      "americana",
      "bluegrass",
      "folk",
      "acoustic",
      "singer-songwriter",
      "nashville",
    ],
  },
  {
    mainGenre: "Latin",
    keywords: [
      "latin",
      "reggaeton",
      "salsa",
      "bachata",
      "cumbia",
      "latin pop",
      "spanish",
      "latino",
    ],
  },
  {
    mainGenre: "Indie",
    keywords: [
      "indie",
      "indie folk",
      "indie pop",
      "independent",
      "underground",
    ],
  },
  {
    mainGenre: "Blues",
    keywords: ["blues", "delta blues", "electric blues"],
  },
  {
    mainGenre: "Reggae",
    keywords: ["reggae", "ska", "dub", "dancehall", "caribbean"],
  },
  {
    mainGenre: "World",
    keywords: [
      "world",
      "afrobeat",
      "k-pop",
      "j-pop",
      "bossa nova",
      "african",
      "asian",
      "global",
    ],
  },
  {
    mainGenre: "Chill",
    keywords: [
      "chill",
      "relax",
      "calm",
      "mellow",
      "downtempo",
      "study",
      "focus",
      "sleep",
      "meditation",
    ],
  },
  {
    mainGenre: "Party",
    keywords: [
      "party",
      "celebration",
      "festive",
      "upbeat",
      "energetic",
      "hype",
      "turn up",
    ],
  },
  {
    mainGenre: "Workout",
    keywords: [
      "workout",
      "gym",
      "fitness",
      "running",
      "cardio",
      "exercise",
      "training",
      "motivation",
    ],
  },
  {
    mainGenre: "Throwback",
    keywords: [
      "throwback",
      "oldies",
      "classic",
      "retro",
      "vintage",
      "90s",
      "80s",
      "70s",
      "nostalgia",
    ],
  },
  {
    mainGenre: "Seasonal",
    keywords: [
      "summer",
      "winter",
      "spring",
      "fall",
      "autumn",
      "holiday",
      "christmas",
      "halloween",
    ],
  },
];

// Helper functions
const capitalizeGenre = (genre: string): string =>
  genre.charAt(0).toUpperCase() + genre.slice(1);

const calculateTotalTracks = (genres: { count: number }[]): number =>
  genres.reduce((sum, g) => sum + g.count, 0);

/**
 * Categorizes a specific genre into a broader main genre
 * @param genre - The specific genre from Spotify (e.g., "indie rock")
 * @returns The main genre category (e.g., "Rock") or the original genre if no match
 */
export function categorizeGenre(genre: string): string {
  const lowerGenre = genre.toLowerCase();

  for (const category of GENRE_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (lowerGenre.includes(keyword)) {
        return category.mainGenre;
      }
    }
  }

  return capitalizeGenre(genre);
}

/**
 * Analyzes a list of genres and returns both main categories and sub-genres
 * @param genres - Array of genre objects with count
 * @returns Object with mainGenres and subGenres
 */
export function analyzeGenreHierarchy(
  genres: { genre: string; count: number; percentage: number }[],
) {
  const mainGenreMap = new Map<string, number>();
  const subGenresByMain = new Map<
    string,
    { genre: string; count: number }[]
  >();

  genres.forEach(({ genre, count }) => {
    const mainGenre = categorizeGenre(genre);

    // Add to main genre count
    mainGenreMap.set(mainGenre, (mainGenreMap.get(mainGenre) || 0) + count);

    // Track sub-genres under main genre
    if (!subGenresByMain.has(mainGenre)) {
      subGenresByMain.set(mainGenre, []);
    }
    subGenresByMain.get(mainGenre)!.push({ genre, count });
  });

  // Convert to sorted arrays
  const totalCount = calculateTotalTracks(genres);
  const mainGenres = Array.from(mainGenreMap.entries())
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: (count / totalCount) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    mainGenres,
    subGenresByMain: Object.fromEntries(subGenresByMain),
  };
}

/**
 * Calculates genre diversity score (0-100)
 * Lower score = more focused playlist, Higher score = more diverse
 * @param genres - Array of genre objects
 * @returns Diversity score
 */
export function calculateGenreDiversity(
  genres: { genre: string; count: number }[],
): number {
  if (genres.length === 0) return 0;

  const totalTracks = calculateTotalTracks(genres);

  // Calculate entropy (Shannon entropy)
  let entropy = 0;
  genres.forEach(({ count }) => {
    const probability = count / totalTracks;
    if (probability > 0) {
      entropy -= probability * Math.log2(probability);
    }
  });

  // Normalize to 0-100 scale
  const maxEntropy = Math.log2(genres.length);
  const diversityScore = maxEntropy > 0 ? (entropy / maxEntropy) * 100 : 0;

  return Math.round(diversityScore);
}

/**
 * Suggests a playlist genre label based on analysis
 * @param genres - Sorted array of genres by frequency
 * @returns Suggested genre label
 */
export function suggestPlaylistGenre(
  genres: { genre: string; count: number; percentage: number }[],
): string {
  if (genres.length === 0) return "Mixed";

  const topGenre = genres[0];
  const secondGenre = genres[1];

  // If top genre dominates, use it alone
  if (topGenre.percentage > DOMINANT_GENRE_THRESHOLD) {
    return categorizeGenre(topGenre.genre);
  }

  // If top 2 genres are close and combine sufficiently, use both
  if (
    secondGenre &&
    topGenre.percentage - secondGenre.percentage <
      CLOSE_GENRE_DIFFERENCE_THRESHOLD &&
    topGenre.percentage + secondGenre.percentage > COMBINED_GENRE_THRESHOLD
  ) {
    const main1 = categorizeGenre(topGenre.genre);
    const main2 = categorizeGenre(secondGenre.genre);

    // Avoid redundancy if both categorize to same main genre
    if (main1 === main2) {
      return main1;
    }

    return `${main1} / ${main2}`;
  }

  // Otherwise, it's a mixed playlist
  return "Mixed";
}

/**
 * Extracts genre keywords from playlist name and description
 * @param name - Playlist name
 * @param description - Playlist description
 * @returns Array of detected genres (max 3)
 */
export function extractGenresFromPlaylist(
  name: string,
  description?: string,
): string[] {
  const text = `${name} ${description || ""}`.toLowerCase();
  const detectedGenres = new Set<string>();

  // Check each genre category
  for (const category of GENRE_CATEGORIES) {
    for (const keyword of category.keywords) {
      if (text.includes(keyword)) {
        detectedGenres.add(category.mainGenre);
        break; // Only add main genre once per category
      }
    }
  }

  return Array.from(detectedGenres).slice(0, MAX_DETECTED_GENRES);
}
