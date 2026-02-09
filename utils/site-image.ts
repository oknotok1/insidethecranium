/**
 * Utility for fetching site images with multiple fallback sources
 */

export interface ImageSource {
  type: "screenshot" | "og" | "twitter" | "favicon" | "direct";
  url: string;
  priority: number;
}

/**
 * Generate image sources for a website URL
 * Returns array of image URLs to try in order (priority)
 */
export function getSiteImageSources(url: string): ImageSource[] {
  const domain = new URL(url).hostname;
  
  return [
    // 1. High-res favicon via Google (most reliable, 256px)
    {
      type: "favicon",
      url: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
      priority: 1,
    },
    // 2. DuckDuckGo favicon (alternative, good quality)
    {
      type: "favicon",
      url: `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      priority: 2,
    },
    // 3. Microlink screenshot (full page preview, slower but works)
    {
      type: "screenshot",
      url: `https://api.microlink.io/screenshot?url=${encodeURIComponent(url)}&waitUntil=networkidle0`,
      priority: 3,
    },
  ];
}

/**
 * Get primary image URL for a site
 * Includes custom imageUrl if provided, otherwise uses first fallback
 */
export function getPrimarySiteImage(
  url: string,
  customImageUrl?: string
): string {
  if (customImageUrl) {
    return customImageUrl;
  }
  
  // Default to Google favicon (most reliable)
  const domain = new URL(url).hostname;
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
}
