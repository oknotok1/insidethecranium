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
   - `/utils/` - App-specific utilities (Spotify API, logger, rate limiting, genre categorization)
   - `/contexts/` - React contexts with their exclusive hooks in `contexts/hooks/`
   - `/types/` - TypeScript type definitions
   - `/data/` - Static data files with TypeScript types (designed for easy database migration)
   - `/app/actions/` - Next.js server actions

2. **API Routes Structure**: Follow REST conventions and group by external service

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

1. **Minimize `useEffect` Usage**:
   - ❌ Don't use `useEffect` for derived state
   - ✅ Calculate derived values directly from existing state
   - ✅ Use SWR's `onSuccess` callbacks for side effects
   - ✅ Consolidate related effects into single `useEffect` when necessary

2. **Prefer Derived State Over Additional State**:

   ```typescript
   // ❌ Bad: Extra state for derived value
   const [isLoading, setIsLoading] = useState(false);

   // ✅ Good: Derive from existing SWR state
   const isLoading = isLoadingCurrentlyPlaying || isLoadingRecentlyPlayed;
   ```

3. **Use SWR for Data Fetching**:
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

### TypeScript

- Strict mode enabled - no implicit any
- Define interfaces for all API responses
- Use type imports: `import type { Type } from "..."`

### Code Quality

1. **Before committing**:
   - Run linter and fix all errors
   - Check for unused imports and variables
   - Verify no build errors with dynamic imports

2. **Import Organization**:
   - Check for both static AND dynamic imports when refactoring
   - Dynamic imports use: `import("@/path/to/module")`
   - Always update tsconfig paths if moving files

3. **Server Actions**:
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
