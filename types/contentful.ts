/**
 * Contentful CMS Type Definitions
 * 
 * This file contains TypeScript types for all Contentful content models.
 * 
 * Structure:
 * 1. Common Contentful Types - Shared types across all content models
 * 2. Featured Music Types - Homepage featured songs
 * 3. Concert Types - Concert entries and transformed views
 * 
 * @see utils/contentful.ts for transformation functions
 * @see utils/contentful-management.ts for CMS operations
 */

// ============================================================================
// Common Contentful Types
// ============================================================================

/**
 * Contentful system metadata present on all entries
 */
export interface ContentfulSys {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedVersion?: number; // Present only if entry is published
}

/**
 * Contentful asset (image, video, file)
 */
export interface ContentfulAsset {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description?: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

// ============================================================================
// Featured Music Types (Homepage)
// ============================================================================

export interface FeaturedSong {
  name?: string;
  artist?: string;
  url: string;
}

export interface FeaturedMusicFields {
  featuredSongs?: FeaturedSong[];
}

// ============================================================================
// Concert Types
// ============================================================================

/**
 * Raw concert fields from Contentful CMS
 * 
 * Schema last updated: 2026-02-17T09:18:37.809Z
 * Total fields: 19 (4 required: title, slug, venueName, eventDate)
 */
export interface ConcertFields {
  // Required Fields (4)
  title: string;                    // Symbol, required
  slug: string;                     // Symbol, required, unique
  venueName: string;                // Symbol, required
  eventDate: string;                // Date, required - ISO 8601 date string

  // Basic Information (2)
  subtitle?: string;                // Symbol, optional
  artistBand?: string;              // Symbol, optional
  
  // Venue & Location (2)
  venueLocation?: string;           // Symbol, optional
  venueLink?: string;               // Symbol, optional, URL validation

  // Event Details (3)
  genres?: string[];                // Array of Symbols, optional
  status?: "confirmed" | "on-fence" | "went"; // Symbol, optional, enum values, default: "confirmed"
  price?: string;                   // Symbol, optional - e.g., "$50", "€30"

  // Organization & Tickets (3)
  organizer?: string;               // Symbol, optional
  organizerUrl?: string;            // Symbol, optional, URL validation
  ticketLink?: string;              // Symbol, optional, URL validation

  // Content (1)
  reflection?: string;              // Text, optional - Markdown supported

  // Links & References (1)
  setlistFmLink?: string;           // Symbol, optional, URL validation - WARNING: camelCase

  // Media Assets (3) - may be ContentfulAsset or unresolved Link
  coverImage?: ContentfulAsset | { sys: { id: string } };     // Link to Asset (image), optional
  galleryImages?: (ContentfulAsset | { sys: { id: string } })[]; // Array of Links to Assets (images), optional
  videos?: (ContentfulAsset | { sys: { id: string } })[]; // Array of Links to Assets (videos), optional
}

/**
 * Raw concert entry skeleton for Contentful API
 * Compatible with Contentful SDK's EntrySkeletonType
 */
export interface Concert {
  contentTypeId: "concert";
  fields: ConcertFields;
}

/**
 * Transformed concert for list views (admin & public)
 * Simplified structure with flattened fields
 */
export interface ConcertListItem {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;
  artistBand?: string;
  genres?: string[];
  venueName: string;
  venueLocation?: string;
  eventDate: string;
  organizer?: string;
  organizerUrl?: string;
  status?: "confirmed" | "on-fence" | "went";
  price?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  ticketLink?: string;
  venueLink?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transformed media item for gallery
 */
export interface GalleryImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Transformed video item
 */
export interface VideoItem {
  url: string;
  fileName: string;
  contentType: string;
}

/**
 * Full concert detail for single concert view
 * Extends list item with additional fields and media
 */
export interface ConcertDetail extends ConcertListItem {
  reflection?: string;
  organizer?: string;
  ticketLink?: string;
  venueLink?: string;
  setlistFmLink?: string; // Corrected field name (from Contentful's `setlistFmLink`)
  galleryImages: GalleryImage[];
  videos: VideoItem[];
}
