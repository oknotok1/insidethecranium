# Inside The Cranium - Project Rules

You are working on "Inside The Cranium", a Next.js music showcase website that integrates with Spotify and Contentful CMS. Follow these project-specific guidelines when making changes.

## Project Overview

- **Purpose**: Personal music showcase featuring Spotify playlists, currently playing tracks, curated songs, and concert memories
- **Stack**: Next.js 16.1.6 (Turbopack), TypeScript, React, Tailwind CSS, SCSS Modules, shadcn/ui
- **Key Integrations**: Spotify Web API, Spotify Web Playback SDK, Contentful CMS
- **State Management**: React Context API + SWR for data fetching

## SEO & Metadata

- **Root metadata**: Comprehensive SEO setup in `app/layout.tsx` with OG/Twitter cards
- **Admin routes**: Protected from indexing via `app/admin/layout.tsx` with `robots: { index: false, follow: false }`
- **Page-specific metadata**: Each route can override/extend root metadata as needed

## Code Organization Principles

### Component Structure

1. **Colocation is Key**: Keep child components with their parents
   - If component A is ONLY used by component B, place A inside B's folder
   - Example: `ConnectLinks` only used by `Footer` → lives in `Footer/ConnectLinks.tsx`
   - Example: `useSpotifyPlayer` only used by `AppContext` → lives in `contexts/hooks/useSpotifyPlayer.ts`
   - **Benefit**: Deleting a parent automatically removes all its exclusive children

2. **Component Folder Organization**:

   ```
   components/
   ├── Homepage/          # Homepage-specific sections
   ├── Layout/            # Layout components (Footer, Navbar)
   ├── Music/             # Music player and display components
   ├── Playlists/         # Playlist-related components
   ├── Theme/             # Theme switching components
   ├── common/            # Shared utility components (ComingSoon, ImageWithFallback, ScrollToTop)
   └── ui/                # shadcn/ui components ONLY (never custom components)
   ```

3. **No Parentheses in Component Folders**: Use `components/Homepage/` not `components/(Homepage)/`
   - Parentheses `(Folder)` are for Next.js route groups in `/app/` only

### File Organization

1. **Folder Separation**:
   - `/lib/` - Configuration & third-party utilities (navigation config, shadcn cn() utility)
   - `/utils/` - App-specific utilities (Spotify API, Contentful CMS, logger, rate limiting, genre categorization)
   - `/contexts/` - React contexts with their exclusive hooks in `contexts/hooks/`
   - `/types/` - TypeScript type definitions (use `.ts` not `.d.ts`)
   - `/data/` - Static data files with TypeScript types (designed for easy database migration)
   - `/app/actions/` - Next.js server actions

2. **Utility Functions - DRY Principle**:
   - **ALWAYS** extract reusable logic into utility functions
   - **NEVER** duplicate API fetching patterns across multiple files
   - When you see similar code in 2+ places, consolidate into a utility

   **Available Utilities**:
   - `utils/spotify.ts` - Spotify API utilities:
     - `extractSpotifyId()` - Extract Spotify ID from URL
     - `safeFetchSpotify()` - Generic safe fetch with error handling
     - `fetchPlaylists()` - Fetch user playlists with genres
     - `getSpotifyAccessToken()` - Token management
   - `utils/contentful.ts` - Contentful CMS utilities:
     - `getContentfulClient()` - Get configured client
     - `fetchCuratedTracks()` - Fetch curated tracks from Contentful + Spotify data
   - `utils/logger.ts` - Centralized logging with timestamps
   - `utils/rateLimitHandler.ts` - Rate limiting utilities
   - `utils/genreCategorization.ts` - Genre categorization logic

3. **API Routes Structure**: Follow REST conventions and group by external service

   ```
   app/api/
   ├── spotify/                    # All Spotify endpoints grouped together
   │   ├── auth/                   # Authentication endpoints
   │   │   ├── callback/           # OAuth callback
   │   │   ├── exchange/           # Token exchange
   │   │   └── token/              # Token refresh
   │   ├── player/                 # Playback endpoints
   │   │   ├── currently-playing/
   │   │   └── recently-played/
   │   ├── playlists/              # Playlist management
   │   ├── tracks/                 # Track information
   │   └── artists/
   │       └── genres/             # Artist genre information
   ├── contentful/                 # Contentful CMS endpoints
   │   └── entries/
   └── admin/                      # Internal admin endpoints
       └── refresh/
   ```

   **Key Principles:**
   - Group endpoints by external service (spotify, contentful, etc.)
   - Use subfolders for logical groupings (auth, player, etc.)
   - URL structure matches file structure exactly
   - Use lowercase for consistency (contentful, not Contentful)

## React & State Management

### DRY & KISS Principles

1. **Extract Constants** - Never hardcode values used multiple times:

   ```typescript
   // ✅ GOOD - Constants at top
   const DISPLAY_LIMIT = 10;
   const SECTION_ID = "featured-songs";

   const displayedTracks = showAll ? tracks : tracks.slice(0, DISPLAY_LIMIT);
   const hasMore = tracks.length > DISPLAY_LIMIT;

   // ❌ BAD - Magic numbers repeated
   const displayedTracks = showAll ? tracks : tracks.slice(0, 10);
   const hasMore = tracks.length > 10;
   ```

2. **Extract Helper Functions** - Avoid repeating logic:

   ```typescript
   // ✅ GOOD - Extracted helper
   const scrollToSection = () => {
     const section = document.getElementById(SECTION_ID);
     if (section) {
       section.scrollIntoView({ behavior: "smooth", block: "start" });
     }
   };

   const handleToggle = () => {
     if (showAll) scrollToSection();
     setShowAll(!showAll);
   };

   // ❌ BAD - Duplicated scroll logic
   const handleToggle = () => {
     if (showAll) {
       const section = document.getElementById("featured-songs");
       if (section)
         section.scrollIntoView({ behavior: "smooth", block: "start" });
     }
     setShowAll(!showAll);
   };
   ```

3. **Extract Render Functions** - When rendering logic is duplicated:

   ```typescript
   // ✅ GOOD - Single render function
   const renderTrack = (track: TrackWithGenres) => (
     <MusicCard
       title={track.name}
       subtitle={track.artists[0]?.name}
       genres={track.genres}
       artwork={track.album.images[0]?.url}
       spotifyUrl={getSpotifyTrackUrl(track.id)}
     />
   );

   // Use in both mobile and desktop
   {
     tracks.map((track) => renderTrack(track));
   }

   // ❌ BAD - Duplicated JSX
   <MusicCard title={track.name} ... />
   // ... same props repeated in different section
   ```

4. **Minimize `useEffect` Usage**:
   - ❌ Don't use `useEffect` for derived state
   - ✅ Calculate derived values directly from existing state
   - ✅ Use SWR's `onSuccess` callbacks for side effects
   - ✅ Consolidate related effects into single `useEffect` when necessary

5. **Prefer Derived State Over Additional State**:

   ```typescript
   // ❌ Bad: Extra state for derived value
   const [isLoading, setIsLoading] = useState(false);

   // ✅ Good: Derive from existing SWR state
   const isLoading = isLoadingCurrentlyPlaying || isLoadingRecentlyPlayed;
   ```

6. **Use SWR for Data Fetching**:
   - All Spotify API calls use SWR with proper caching
   - Conditional fetching: `useSWR(condition ? url : null, fetcher)`
   - Handle errors gracefully (401, 429, etc.)

### Context Pattern

- Use `AppContext.tsx` for global app state (Spotify player, track data, etc.)
- Minimize context providers - only create when state is truly global
- Colocate context-specific hooks in `contexts/hooks/`

## Spotify Integration

### Authentication & Tokens

- Access tokens refresh automatically via `/api/spotify/auth/token`
- OAuth flow: `/api/spotify/auth/callback` → `/api/spotify/auth/exchange`
- Handle 401 errors gracefully - return `null` instead of throwing
- Never expose client secrets or refresh tokens to client

### API Calls

1. **Rate Limiting**: Be mindful of Spotify API rate limits
   - Use caching aggressively (Next.js Data Cache, SWR)
   - Batch requests when possible (e.g., artist genres)

2. **Error Handling**:

   ```typescript
   // Always handle common HTTP errors
   if (res.status === 401) {
     console.warn("Token not ready yet");
     return null; // Don't crash
   }
   if (res.status === 429) {
     // Handle rate limiting
   }
   ```

3. **Logger Utility**: Use the custom logger for all API logging

   ```typescript
   import { logger } from "@/utils/logger";

   logger.log("Context", "Message");
   logger.warn("Context", "Warning");
   logger.error("Context", "Error");
   logger.success("Context", "Success");
   ```

   - All logs include GMT+8 timestamps
   - Use clear context identifiers

## Design System & UI/UX

### Brand Colors & Visual Identity

- **Primary**: `#3d38f5` (vivid purple) - Used for CTAs, brand elements, accents
- **Secondary**: `#8b87ff` (light purple) - Used for gradients, hover states, subtle accents
- **Gradients**: `linear-gradient(135deg, #3d38f5 0%, #8b87ff 100%)` for primary elements
- **Text Gradients**: `linear-gradient(to right, #8b87ff, #3d38f5, #8b87ff)` for animated headers

### Layout & Spacing

1. **Section Spacing**: Use consistent spacing for homepage sections

   ```tsx
   <section className="py-12 sm:py-16 lg:py-20">
   ```

2. **Container Pattern**: Max-width container with responsive padding

   ```tsx
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
   ```

3. **Background Patterns**:
   - **Alternating backgrounds**: Currently commented out in `styles/tailwind.css` - clean, uniform background throughout
   - **Card backgrounds**: `bg-gray-100 dark:bg-white/5` at rest, becomes `bg-gray-200 dark:bg-white/10` on hover for subtle feedback
   - **Card borders & shadows**: Removed for cleaner, modern look - background contrast provides sufficient visual separation
   - **Card hover effects**: Background color change only (no scale animation)
   - **Internal borders/dividers**: Use `border-gray-200 group-hover:border-gray-300 dark:border-white/10 dark:group-hover:border-white/15` to maintain visibility on card hover
   - **Chips/badges inside cards**: Use `bg-gray-200 group-hover:bg-gray-300 dark:bg-white/5 dark:group-hover:bg-white/10` to maintain contrast on card hover

4. **Mobile Carousels**: Homepage sections use horizontal scrolling carousels on mobile (< lg breakpoint)

   ```tsx
   {
     /* Mobile carousel */
   }
   <div className="-mx-4 block overflow-hidden sm:-mx-6 lg:hidden">
     <div className="scrollbar-hide flex items-stretch gap-4 overflow-x-scroll">
       {items.map((item, index) => (
         <div
           key={item.id}
           className={`w-[45%] max-w-[200px] min-w-[160px] shrink-0 md:w-[30%] md:max-w-[240px] ${
             index === 0 ? "ml-4 sm:ml-6" : ""
           }`}
         >
           <div className="h-full">
             <ItemCard {...item} />
           </div>
         </div>
       ))}
       {/* CTA Card - gets right margin */}
       <Link
         href="/view-all"
         className="mr-4 w-[45%] max-w-[200px] min-w-[160px] shrink-0 sm:mr-6 md:w-[30%] md:max-w-[240px]"
       >
         {/* CTA content */}
       </Link>
     </div>
   </div>;

   {
     /* Desktop grid */
   }
   <div className="hidden grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:grid xl:grid-cols-5">
     {/* Grid items */}
   </div>;
   ```

   - **Key patterns**:
     - Negative margins on wrapper (`-mx-4 sm:-mx-6`) for edge-to-edge scrolling
     - First item gets left margin (`ml-4 sm:ml-6`)
     - Last item gets right margin (`mr-4 sm:mr-6`)
     - `items-stretch` ensures uniform height matching the tallest card
     - Wrap cards in `<div className="h-full">` to propagate height
     - No snap scrolling - smooth, natural scrolling
     - `scrollbar-hide` utility to hide scrollbars
     - Responsive widths: `w-[45%]` mobile, `md:w-[30%]` tablet with min/max constraints

### Typography

- **Headings**: Bold, large scale (4xl → 5xl → 6xl on mobile → tablet → desktop)
- **Body**: Gray scale for hierarchy (`text-gray-700 dark:text-gray-300`)
- **Subtle text**: `text-gray-500 dark:text-gray-500`
- **Font stack**: System fonts for performance (defined in `globals.scss`)

### Interactive Elements

1. **Unified Card Design (2026 Style)** - Use Common Card Component:

   ```tsx
   // Import the Card component
   import { Card, InteractiveCard } from "@/components/common/Card";

   // As a link (Next.js Link)
   <Card as="link" href="/path">{content}</Card>

   // As external link
   <Card as="anchor" href="https://..." target="_blank" rel="noopener noreferrer">{content}</Card>

   // As button
   <Card as="button" onClick={handleClick}>{content}</Card>

   // As interactive div
   <InteractiveCard onClick={handleClick}>{content}</InteractiveCard>

   // As plain div (default)
   <Card>{content}</Card>
   ```

   - **DO NOT** manually apply card styling - use the Card component
   - **Border Radius**: `rounded-lg` (handled by Card component)
   - **Background**: `bg-gray-100 dark:bg-white/5` at rest → `hover:bg-gray-200 dark:hover:bg-white/10`
   - **Borders & Shadows**: Removed for clean, modern aesthetic - background contrast provides visual separation
   - **Hover Effects**: Background color change only (no scale, no shadow change)
   - **Transitions**: `transition-all duration-300` for smooth animations
   - **Image Hover**: All card images should use `group-hover:scale-102 transition-transform duration-300`
   - **Grid Layout**: Use `items-stretch` in carousels or wrapper `flex` to ensure cards in same row match height
   - **Legacy**: Old design saved in `components/common/LegacyPlaylistCard.tsx`

2. **Buttons & Links**:
   - **Primary CTA**: Purple solid (`#3d38f5`) with white text
   - **Secondary/Tertiary**: Match card style with `rounded-2xl`:
     ```tsx
     className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5
                hover:border-gray-200 dark:hover:border-white/10
                rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
     ```
   - **Filter Buttons**: `rounded-full` for pill-shaped filters with `cursor-pointer`
   - **Text Links**: Simple underline or arrow icon, no background

3. **Icon Patterns**:
   - Icon size consistency: `w-4 h-4 sm:w-5 sm:h-5` for small, `w-10 h-10 sm:w-12 sm:h-12` for medium
   - Icons in gradients: White text on purple gradient backgrounds
   - Animated icons: Subtle animations like `animate-pulse` for sparkles
   - Icon hover effects: `group-hover:translate-x-1` for arrows

4. **Tag/Badge Chips**:
   - **Use Common Component**: `<Chip>` from `@/components/common/Chip`
   - **Variants**: `default` (gray) or `primary` (purple)
   - **Sizes**: `Chip` (standard) or `ChipLarge` (more padding, rounded-full)
   - **Colors & Hover States**:
     - Default (at rest): `bg-gray-200 dark:bg-white/5` - proper contrast against card backgrounds
     - Default (on card hover): `group-hover:bg-gray-300 dark:group-hover:bg-white/10` - stays visible when card darkens
     - Primary hover: `group-hover:bg-[#3d38f5]/20 dark:group-hover:bg-[#3d38f5]/30` - more vivid on hover

   ```tsx
   import { Chip } from "@/components/common/Chip";

   // Default gray chip - automatically handles contrast and hover
   <Chip>Discovery</Chip>

   // Primary purple chip - with hover enhancement
   <Chip variant="primary">Featured</Chip>

   // Large chip (for desktop-specific layouts)
   <ChipLarge>Analytics</ChipLarge>
   ```

   - **Manual chips**: If not using Chip component:
     ```tsx
     <span className="bg-gray-200 text-gray-600 transition-colors group-hover:bg-gray-300 dark:bg-white/5 dark:text-gray-400 dark:group-hover:bg-white/10">
       {tag}
     </span>
     ```

### Common Components (Reusable UI Primitives)

1. **Card Component** (`@/components/common/Card`):
   - Unified card wrapper with consistent styling
   - Supports: `div`, `link`, `button`, `anchor` variants
   - Use `InteractiveCard` for clickable cards without navigation

   ```tsx
   import { Card, InteractiveCard } from "@/components/common/Card";

   // As Link
   <Card as="link" href="/path">Content</Card>

   // As clickable div
   <InteractiveCard onClick={handler}>Content</InteractiveCard>

   // As external anchor
   <Card as="anchor" href="https://..." target="_blank" rel="noopener noreferrer">
     Content
   </Card>
   ```

2. **Chip Component** (`@/components/common/Chip`):
   - Consistent badge/tag styling across all components
   - See Tag/Badge Chips section above for usage

**Important**: The `/components/ui/` folder is reserved exclusively for shadcn/ui components.
All custom reusable components should be placed in `/components/common/`.

### Component Patterns

1. **Coming Soon Components**:
   - **Page**: Full-page layout with large icon, animated title, description card, CTAs
   - **Preview**: Section layout for homepage teasers with smaller scale
   - Both use: Brand gradients, sparkle icons, clock icon, consistent spacing

2. **Gradient Backgrounds**:

   ```tsx
   style={{
     background: 'linear-gradient(135deg, rgba(61, 56, 245, 0.08) 0%, rgba(139, 135, 255, 0.04) 50%, rgba(61, 56, 245, 0.08) 100%)'
   }}
   ```

   - Use rgba for opacity control
   - Layer multiple blur effects for depth

3. **Decorative Effects**:
   ```tsx
   <div
     className="absolute top-0 left-1/4 h-64 w-64 rounded-full opacity-30 blur-3xl sm:h-96 sm:w-96"
     style={{ backgroundColor: "rgba(61, 56, 245, 0.3)" }}
   />
   ```

### Responsive Design

- **Mobile-first**: Start with mobile styles, then enhance
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px), `xl:` (1280px)
- **Text scaling**: Always provide mobile → tablet → desktop text sizes
- **Spacing scaling**: Adjust padding/margins across breakpoints
- **Button layouts**: Stack on mobile (`flex-col`), inline on desktop (`sm:flex-row`)

### Dark Mode

- **Always** provide dark mode variants using `dark:` prefix
- Background contrast: White/light gray → Black/dark gray
- Opacity layers: Use `/5`, `/10`, `/20` for subtle overlays
- Test both themes - never design for one theme only

### Animation & Transitions

- **Hover effects**: `hover:scale-105` for buttons and interactive cards
- **Smooth transitions**: `transition-all duration-300` or `transition-transform`
- **Group hover**: Use `group` and `group-hover:` for icon animations within buttons
- **Pulse animations**: Subtle `animate-pulse` for attention elements

### Accessibility

- Maintain color contrast ratios (WCAG AA minimum)
- Provide hover states for all interactive elements
- Use semantic HTML (`<section>`, `<nav>`, `<main>`)
- Test keyboard navigation

### Styling

#### Tailwind + SCSS Modules

- Use **Tailwind CSS** for utility-first styling
- Use **SCSS modules** for component-specific complex styles
- Never mix global CSS classes with scoped modules

**SCSS Module Setup:**

ALWAYS add the `@reference` directive at the top of `.module.scss` files:

```scss
@reference "../../../styles/tailwind.css";

.section {
  // ... styles
}
```

This enables Tailwind utilities and custom classes in CSS modules. Adjust the relative path based on component location.

**SCSS Module Nesting Rules:**

ALWAYS nest classes to mirror the component's JSX structure. This improves:

- **Readability**: Visual hierarchy matches component structure
- **Maintainability**: Easy to find and refactor related styles
- **Cascade**: Proper style inheritance and specificity

```scss
// ✅ GOOD - Nested structure mirrors JSX hierarchy
.section {
  @apply py-12 sm:py-16 lg:py-20;

  .container {
    @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;

    .header {
      @apply mb-8 sm:mb-12;

      .title {
        @apply mb-4 text-2xl sm:text-3xl md:text-4xl;
      }

      .subtitle {
        @apply text-sm text-gray-600 sm:text-base dark:text-gray-400;
      }
    }

    .mobileCarousel {
      @apply flex gap-4 overflow-x-scroll;

      .trackCard {
        @apply w-[45%] shrink-0;

        .trackImage {
          @apply rounded-lg;
        }
      }
    }
  }
}

// ❌ BAD - Flat structure, no hierarchy
.section {
  @apply py-12 sm:py-16 lg:py-20;
}

.container {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
}

.header {
  @apply mb-8 sm:mb-12;
}

.title {
  @apply mb-4 text-2xl sm:text-3xl md:text-4xl;
}
```

**Tailwind Class Grouping:**

When classes get long, use **multiple @apply statements** grouped by **related** properties:

```scss
// ✅ GOOD - Group related properties together
.card {
  @apply mx-4 mt-6 p-6 sm:mx-6; // Spacing (margins + padding)
  @apply flex flex-col items-center; // Flexbox/Grid
  @apply w-[45%] max-w-[200px] min-w-[160px] shrink-0; // Sizing
  @apply rounded-xl; // Border radius
  @apply border-2 border-gray-300 dark:border-gray-700; // Borders
  @apply bg-white dark:bg-gray-900; // Backgrounds
  @apply text-sm font-medium text-gray-600; // Typography
  @apply transition-colors; // Transitions
  @apply hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-white/10; // Hover states
}

// ❌ BAD - All properties on one long line
.card {
  @apply mx-4 mt-6 flex w-[45%] max-w-[200px] min-w-[160px] shrink-0 flex-col items-center rounded-xl border-2 border-gray-300 bg-white p-6 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-100 sm:mx-6 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-white/10;
}

// ❌ ALSO BAD - Too granular, one property per line
.card {
  @apply mx-4;
  @apply sm:mx-6;
  @apply mt-6;
  @apply p-6;
  // ... etc (too verbose)
}
```

**Grouping Guidelines (in order):**

Group **related** properties together on the same line:

1. **Spacing**: `mx-4 sm:mx-6 mt-6 p-6 px-4` (margins and padding together)
2. **Display & Flexbox/Grid**: `flex flex-col items-center justify-between gap-4`, `hidden lg:grid`, `block overflow-hidden`
3. **Sizing**: `w-[45%] min-w-[160px] max-w-[200px] h-full shrink-0` (all width/height/size properties together)
4. **Border Radius**: `rounded-lg`, `rounded-xl`
5. **Borders**: `border-2 border-dashed border-gray-300 dark:border-gray-700` (all border properties together)
6. **Backgrounds**: `bg-white dark:bg-gray-900`
7. **Typography**: `text-sm font-bold text-gray-600 text-center` (size, weight, color, alignment together)
8. **Effects & Other**: `shadow-lg opacity-50 overflow-hidden cursor-pointer`
9. **Transitions**: `transition-all duration-300`, `transition-colors`
10. **Hover States**: `hover:bg-gray-100 hover:border-gray-400 dark:hover:bg-white/10` (all hover states on one line)

**Key Principles:**

- **Group related properties**: Put all width/sizing together, all spacing together, all borders together
- **Balance readability**: Not too granular (1 property per line) nor too dense (everything on one line)
- **Meaningful groupings**: Each line should represent a logical category
- **Dark mode with base**: Keep `dark:` variants with their base properties on the same line

**Benefits:**

- Each line represents a logical property group
- Easy to scan and understand styling at a glance
- Easy to add, remove, or reorder groups
- More maintainable than single long line
- Deleting a parent class removes all nested children automatically
- Clear visual mapping between JSX and styles

#### shadcn/ui Components

- Only use `/components/ui/` for shadcn/ui components
- Never create custom components in this folder
- Import shadcn components as needed via CLI

### Design Consistency Checklist

When creating or modifying UI components, **always**:

- [ ] Use brand colors (`#3d38f5`, `#8b87ff`) for accents and CTAs
- [ ] Include dark mode variants for all colors and backgrounds
- [ ] Apply consistent section spacing (`py-12 sm:py-16 lg:py-20`)
- [ ] Use the standard container pattern (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`)
- [ ] Implement mobile-first responsive scaling for text and spacing
- [ ] Add smooth transitions and hover effects
- [ ] Use rounded corners (`rounded-2xl` or `rounded-3xl` for cards, `rounded-full` for buttons)
- [ ] Test in both light and dark modes

## Performance & Optimization

### Image Optimization

1. **Next.js Image Component**:
   - **Always** use `next/image` via `ImageWithFallback` component - never use raw `<img>` tags
   - Provides automatic optimization, responsive images, lazy loading, and blur placeholders
   - Significantly improves RES (Real Experience Score) and Core Web Vitals
   - All external domains configured in `next.config.mjs` `remotePatterns`

2. **ImageWithFallback Component** (`@/components/common/ImageWithFallback`):
   - Wraps Next.js Image with error handling and fallback to placeholder
   - **Required props**:
     - `src`: Image URL
     - `alt`: Alt text
     - `fill` OR `width`/`height`: Choose based on container
   - **Recommended props**:
     - `sizes`: Responsive sizes hint (e.g., `"(max-width: 640px) 50vw, 33vw"`)
     - `priority`: Set to `true` for above-the-fold images (Hero, first section)

   ```tsx
   // For aspect-ratio containers (most common)
   <div className="relative aspect-square">
     <ImageWithFallback
       src={imageUrl}
       alt="Description"
       fill
       sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
       className="object-cover"
     />
   </div>

   // For fixed dimensions
   <ImageWithFallback
     src={imageUrl}
     alt="Description"
     width={256}
     height={256}
     className="object-cover"
   />

   // Above-the-fold (Hero)
   <ImageWithFallback
     src={heroImage}
     alt="Hero"
     fill
     priority
     sizes="256px"
   />
   ```

3. **Image Loading Strategy**:
   - **Priority images**: Hero image, above-the-fold content (`priority={true}`)
   - **Lazy loading**: All other images (default Next.js behavior)
   - **External images**: Proxied through `/api/screenshot` for site previews to avoid CORS
   - **Unoptimized**: Use `unoptimized={true}` for already-optimized external APIs

### Caching Strategy

1. **Next.js Data Cache**:
   - Use `revalidate` for time-based invalidation
   - Use `revalidateTag()` for on-demand invalidation
   - Example: `export const revalidate = 86400; // 24 hours`

2. **SWR Configuration**:
   - Set appropriate `refreshInterval` for polling
   - Use `dedupingInterval` to prevent duplicate requests
   - Implement optimistic updates where appropriate

### Loading States

- Always show loading skeletons, never flash of unstyled content
- Use `isLoadingInitialData` pattern to prevent UI flashing
- Skeleton components should match actual content dimensions

## Data Management

### Static Data Files (`/data/`)

1. **Purpose**: Store static/seed data that will eventually move to a database
2. **Structure**:

   ```typescript
   // Define TypeScript types for the data
   export type Category = "Type1" | "Type2";

   export interface DataItem {
     id: string; // Always include unique ID for database migration
     name: string;
     // ... other fields
   }

   // Main data array
   export const items: DataItem[] = [
     /* ... */
   ];

   // Helper functions (will become database queries)
   export function getItemById(id: string): DataItem | undefined {
     /* ... */
   }
   export function getItemsByCategory(category: Category): DataItem[] {
     /* ... */
   }
   ```

3. **Database Migration Comments**: Include comments documenting the intended database schema
4. **Helper Functions**: Create data access functions that mirror future database queries

### Example: Sites Data

- File: `/data/sites.ts`
- Includes database schema documentation for future migration
- Helper functions (`getSitesByTag`, `getFeaturedSites`) designed to match future SQL queries
- Easy to replace with actual database calls later
- **Smart Image Loading System**: Multi-source fallback for site images
  - **Auto-fetch Priority** (tries each on error):
    1. Microlink OG/Twitter image (rich social media previews)
    2. Google high-res favicon (256px - clean, recognizable branding)
    3. Microlink screenshot API (full page preview - useful for low-res favicons)
    4. DuckDuckGo favicon (alternative favicon source)
    5. Globe icon fallback (always works if all external sources fail)
  - **Custom Override**: Optionally provide `imageUrl` to use specific branding
  - **Automatic Cascading**: On image load error, automatically tries next source
  - **Component**: `SiteImage.tsx` handles state and fallback logic
  - **Utility**: `utils/site-image.ts` generates prioritized source URLs
  - **No API keys required** - uses free public services
  - **Benefits**: OG images when available for rich visuals, favicons for consistency,
    screenshots as last resort to ensure every site has decent imagery

## Best Practices

### TypeScript Standards

#### Type Definitions

1. **When to Create Interfaces**:

   **Only create interfaces when**:
   - Used in **2+ places** (shared across components/functions)
   - **Complex props** (>7 props, approaching 10)
   - Part of a **public API** or exported for reuse

   **Don't create interfaces for**:
   - Simple components with **≤7 props** - use inline types
   - Single-use, local types - keep inline
   - 1-2 prop components - definitely inline

   ```typescript
   // ✅ GOOD - Simple props, inline type
   const Card = ({
     title,
     description,
   }: {
     title: string;
     description?: string;
   }) => (
     <div>
       <h2>{title}</h2>
       {description && <p>{description}</p>}
     </div>
   );

   // ✅ GOOD - Complex props (8+ props), use interface
   interface UserProfileProps {
     id: string;
     name: string;
     email: string;
     avatar: string;
     role: string;
     isActive: boolean;
     lastLogin: Date;
     permissions: string[];
     metadata?: Record<string, unknown>;
   }
   const UserProfile = (props: UserProfileProps) => {
     /* ... */
   };

   // ✅ GOOD - Reused interface
   interface CardProps {
     title: string;
     onClick: () => void;
   }
   const PrimaryCard = (props: CardProps) => {
     /* ... */
   };
   const SecondaryCard = (props: CardProps) => {
     /* ... */
   };

   // ❌ BAD - Unnecessary interface for 2 props
   interface CardProps {
     title: string;
     description: string;
   }
   const Card = ({ title, description }: CardProps) => {
     /* ... */
   };
   ```

2. **Prefer `interface` over `type`** - Use `interface` for object shapes, reserve
   `type` for:
   - Union types: `type Status = "pending" | "success" | "error"`
   - Intersections: `type Combined = Base & Extension`
   - Primitive aliases: `type ID = string`
   - Mapped types: `type ReadOnly<T> = { readonly [K in keyof T]: T[K] }`

3. **Type Utilities** - ALWAYS use `Pick`/`Omit` instead of duplicating types:

   ```typescript
   // ✅ GOOD - Use Pick for subset of properties
   const useTrackGenres = (
     track: Pick<Track, "id" | "artists"> | undefined,
     accessToken: string | undefined
   ) => { ... };

   // ✅ GOOD - Use Omit to exclude properties
   type PublicUser = Omit<User, "password" | "refreshToken">;

   // ✅ GOOD - Use Partial for optional variants
   type UpdateUser = Partial<Pick<User, "name" | "email">>;

   // ❌ BAD - Duplicating type structure
   interface TrackSubset {
     id: string;
     artists: Array<{ id: string; name: string }>;
   }
   const useTrackGenres = (track: TrackSubset | undefined) => { ... };

   // ❌ BAD - Manually defining subset
   type UpdateUser = { name: string; email: string };
   ```

   **When to use which utility**:
   - `Pick<T, K>` - Select specific properties you need
   - `Omit<T, K>` - Exclude specific properties you don't need
   - `Partial<T>` - Make all properties optional
   - `Required<T>` - Make all properties required
   - Combine them: `Partial<Pick<T, K>>` for optional subset

4. **NEVER use `any`** - Always provide proper types:

   ```typescript
   // ❌ NEVER
   const data: any = await response.json();
   catch (error: any) { ... }

   // ✅ ALWAYS
   const data = await response.json() as MyType;
   catch (error) {
     const message = error instanceof Error ? error.message : String(error);
   }

   // ✅ Or use unknown with type guards
   const data: unknown = await response.json();
   if (isMyType(data)) { /* use data */ }
   ```

5. **Minimize Type Assertions (`as`)** - Prefer type guards and proper typing:

   ```typescript
   // ❌ Avoid when possible
   const user = data as User;

   // ✅ Better - type guard
   function isUser(data: unknown): data is User {
     return typeof data === "object" && data !== null && "id" in data;
   }
   if (isUser(data)) {
     /* TypeScript knows data is User */
   }

   // ✅ Acceptable - when you control the data structure
   const fields = entry.fields as ContentfulFields;
   ```

6. **Type File Extension**:
   - **ALWAYS use `.ts` for type files**, NOT `.d.ts`
   - `.d.ts` files are ONLY for declaring types for external JavaScript libraries
   - `.ts` files provide better IDE support, type safety, and compiler checking
   - Example: `types/spotify.ts`, `types/contentful.ts`

7. **Type Organization**:
   - **Source-based**: Group types by their API/service origin
     - `types/spotify.ts` - Spotify API types
     - `types/contentful.ts` - Contentful CMS types
   - **Shared types**: Move to type files when used in 2+ places
   - **Local types**: Keep in file if used only once
   - **Export types**: Always use named exports: `export interface MyType {}`
   - **Property order**: ALWAYS place required properties before optional ones

     ```typescript
     // ✅ GOOD - required props first
     interface Props {
       name: string;
       age: number;
       email?: string;
     }

     // ❌ BAD - optional before required
     interface Props {
       email?: string;
       name: string;
     }
     ```

#### Function Style

1. **Prefer Arrow Functions**:

   ```typescript
   // ✅ Preferred - arrow functions
   const fetchData = async (id: string) => { ... };
   const handleClick = () => { ... };

   // ❌ Avoid - function declarations (except for hoisting needs)
   async function fetchData(id: string) { ... }
   ```

2. **Component Functions**: Use arrow functions for consistency:

   ```typescript
   // ✅ Preferred
   const MyComponent = ({ prop }: Props) => {
     return <div>{prop}</div>;
   };
   export default MyComponent;

   // ❌ Avoid
   export default function MyComponent({ prop }: Props) {
     return <div>{prop}</div>;
   }
   ```

#### Package Management

- **ALWAYS use `yarn`** for package management
- Never use `npm` or `pnpm` commands
- Add dependencies: `yarn add <package>`
- Add dev dependencies: `yarn add -D <package>`
- Install: `yarn install`

#### Type Safety Checklist

When writing code, ensure:

- [ ] No `any` types anywhere
- [ ] Minimal use of type assertions (`as`)
- [ ] Proper error handling with type guards
- [ ] Shared types extracted to type files
- [ ] Arrow functions used consistently
- [ ] All async functions properly typed

### Code Quality

1. **Refactor Protocol**:

   When the user says "refactor", follow this exact process:

   **Step 1: Extract Components**
   - Identify JSX blocks that could be standalone components
   - **Keep in same file** if only used locally (internal components)
   - **Move to separate file** if:
     - Deserves to be a standalone component (complex/reusable)
     - Used in multiple places and needs to be exported
     - Improves file organization significantly
   - Example:

     ```typescript
     // ✅ GOOD - Extracted in same file (only used here)
     const ShowAllButton = ({
       onClick,
       totalCount,
     }: {
       onClick: () => void;
       totalCount: number;
     }) => (
       <button onClick={onClick} className={styles.showAll}>
         <h3>Show All</h3>
         <p>View all {totalCount} items</p>
       </button>
     );

     export default function MyComponent() {
       return (
         <div>
           {/* ... */}
           <ShowAllButton onClick={handleClick} totalCount={items.length} />
         </div>
       );
     }
     ```

   **Step 2: Apply DRY & KISS**
   - Extract repeated constants (magic numbers, strings, IDs)
   - Extract duplicated logic into helper functions
   - Extract repeated JSX into render functions
   - Simplify complex conditionals
   - Remove unnecessary state or effects

   **Step 3: Consolidate Types**
   - Check existing type files (`@/types/`) for reusable types
   - Use `Pick<Type, 'field1' | 'field2'>` when you need a subset
   - Use `Omit<Type, 'field'>` when you need all except some fields
   - Use `Partial<Type>` when all fields should be optional
   - NEVER create duplicate types if a relationship exists
   - Example:

     ```typescript
     // ✅ GOOD - Reuse and extend
     import type { Track } from "@/types/spotify";

     interface TrackCardProps extends Pick<Track, "id" | "name" | "artists"> {
       showGenres?: boolean;
     }
     // ❌ BAD - Duplicate definition
     interface TrackCardProps {
       id: string;
       name: string;
       artists: Array<{ name: string }>;
     }
     ```

   **Step 4: Move Styles to Module**
   - Extract **structural/layout** Tailwind classes to `.module.scss`
   - **Keep theme-related classes INLINE** in JSX:
     - Colors: `text-gray-600`, `bg-white`, `border-gray-300`
     - Dark mode: `dark:text-gray-400`, `dark:bg-gray-900`, `dark:border-gray-700`
     - Hover states with colors: `hover:text-gray-900`, `dark:hover:bg-white/10`
   - Use semantic class names (`.hero`, `.trackCard`, not `.flexCol`)
   - **NEST classes to mirror JSX structure** - parent/child relationships should be reflected in SCSS nesting
   - **USE multiple @apply statements** - group related properties by type (margins, flexbox, sizing, padding, borders, backgrounds, typography, transitions, states)
   - Add comments for complex styling sections
   - Only keep inline styles if:
     - Dynamic values from props/state (e.g., `style={{ width: \`\${progress}%\` }}`)
     - Theme-related classes (colors, dark mode variants)
     - One-off utility that doesn't warrant a class
   - Example transformation:

     ```typescript
     // ❌ BEFORE - Tailwind in JSX
     <section className="py-12">
       <div className="max-w-7xl mx-auto px-4">
         <div className="mb-8">
           <h2 className="text-2xl font-bold">Title</h2>
         </div>
       </div>
     </section>

     // ✅ AFTER - Nested module classes
     <section className={styles.section}>
       <div className={styles.container}>
         <div className={styles.header}>
           <h2 className={styles.title}>Title</h2>
         </div>
       </div>
     </section>

     // styles.module.scss (nested with grouped @apply):
     // .section {
     //   @apply py-12;
     //
     //   .container {
     //     @apply mx-auto max-w-7xl;
     //     @apply px-4;
     //
     //     .header {
     //       @apply mb-8;
     //
     //       .title {
     //         @apply text-2xl;
     //         @apply font-bold;
     //       }
     //     }
     //   }
     // }
     ```

   **Step 5: Verify and Format**
   - Run TypeScript check: `yarn tsc --noEmit`
   - Format code: `yarn prettier --write .`
   - Fix any linter errors that appear

2. **Verification Process - Run After Big Changes**:
   Always run these commands in this exact order:

   ```bash
   # 1. TypeScript check - validates all types
   yarn tsc --noEmit

   # 2. Format code - consistent code style
   yarn prettier --write .
   ```

   **When to run**:
   - After major refactoring
   - After adding/removing dependencies
   - After creating new utility functions
   - After updating type definitions
   - Before creating pull requests

   **Note**: Build check (`yarn build`) is overkill for most changes - only run
   before deployment or when explicitly needed.

3. **Before committing**:
   - Run linter and fix all errors
   - Check for unused imports and variables
   - Verify no build errors with dynamic imports

4. **Import Organization**:

   **Path Aliases - ALWAYS use `@/` for imports outside current folder**:

   ```typescript
   // ✅ GOOD - Use aliases for non-local imports
   import { useAppContext } from "@/contexts/AppContext";

   import { Card } from "@/components/common/Card";

   import { formatDuration } from "@/utils/helpers";

   import type { Track } from "@/types/spotify";

   import { useAppContext } from "../../../contexts/AppContext";
   // ❌ BAD - Don't use relative paths for parent/sibling directories
   import { Card } from "../../common/Card";
   // ✅ GOOD - Relative imports for same folder or subfolders
   import { HeroBackground } from "./Background";
   import { useTrackData } from "./hooks/useTrackData";
   import styles from "./styles.module.scss";
   ```

   **ALWAYS follow this exact import order**:
   1. **External packages** (third-party libraries)
   2. **React** (`react`, `react-dom`, etc.)
   3. **Next.js** (`next/...` imports)
   4. **Contexts** (`@/contexts/...`)
   5. **Components** (`@/components/...`)
   6. **Hooks** (`@/hooks/...` or component-specific hooks)
   7. **Utils/Helpers** (`@/utils/...`, `@/lib/...`)
   8. **Types** (`@/types/...`, `import type { ... }`)
   9. **Styles** (`.css`, `.scss`, `.module.scss`)

   Example:

   ```typescript
   // 1. External

   // 4. External packages
   import { Music2 } from "lucide-react";

   import { useState } from "react";

   // 2. React (already above)

   // 3. Next.js
   import Link from "next/link";
   import { useRouter } from "next/navigation";

   // 5. Contexts
   import { useAppContext } from "@/contexts/AppContext";

   // 6. Components
   import { Card } from "@/components/common/Card";

   // 8. Utils
   import { formatDuration } from "@/utils/helpers";

   // 9. Types
   import type { Track } from "@/types/spotify";

   // 7. Hooks
   import { useTrackData } from "./hooks/useTrackData";
   // 10. Styles
   import styles from "./styles.module.scss";
   ```

   **Notes**:
   - Blank lines separate each group
   - Within each group, sort alphabetically
   - This is enforced by ESLint (`import/order`) and Prettier
   - Check for both static AND dynamic imports when refactoring
   - Dynamic imports use: `import("@/path/to/module")`
   - Always update tsconfig paths if moving files

5. **Server Actions**:
   - Mark with `"use server"` directive
   - Use for cache invalidation and mutations
   - Can be imported dynamically from client components

### Git Workflow

- Meaningful commit messages describing "why" not "what"
- Test builds before pushing
- Keep commits atomic and focused

## Common Patterns

### Creating New Pages

1. Create page in `/app/[route]/page.tsx`
2. Add metadata export
3. Update navigation in `/lib/navigation.ts`
4. Create components in appropriate `/components/` subfolder

### Adding New Components

1. Determine if it's page-specific or shared
2. Place in appropriate folder (Homepage/, Layout/, common/, etc.)
3. If only used by one parent, nest it inside parent's folder
4. Use SCSS modules for complex styling, Tailwind for utilities

### Debugging

- Check terminal logs with GMT+8 timestamps
- Use browser DevTools for client-side debugging
- Server errors appear in terminal, client errors in browser console
- Spotify API errors are logged with context

## Project-Specific Conventions

### Naming

- Files: lowercase with hyphens or PascalCase for components
- Components: PascalCase
- Utilities: camelCase
- Constants: UPPER_SNAKE_CASE
- API routes: lowercase folders matching URL structure (e.g., `/api/spotify/auth/token`)

### API Endpoint Conventions

- **Always** group API routes by external service
- **Always** use lowercase for folder names in `/app/api/`
- **Always** make URL structure match file structure
- Use descriptive subfolder names (auth, player, etc.) for logical grouping
- Internal endpoints go in `/api/admin/`

### Comments

- Document complex logic with clear comments
- Use JSDoc for functions when helpful
- Explain "why" not "what" in comments

### Environment Variables

- Never commit `.env` files
- Use `.env.local` for local development
- Required vars: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`

---

**Remember**: The goal is maintainable, performant code that follows DRY & KISS principles. When in doubt, colocate related code and minimize state management complexity.
