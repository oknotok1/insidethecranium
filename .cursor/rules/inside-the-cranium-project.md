# Inside The Cranium - Project Rules

You are working on "Inside The Cranium", a Next.js music showcase website that integrates with Spotify and Contentful CMS. Follow these project-specific guidelines when making changes.

## Project Overview
- **Purpose**: Personal music showcase featuring Spotify playlists, currently playing tracks, curated songs, and concert memories
- **Stack**: Next.js 16.1.6 (Turbopack), TypeScript, React, Tailwind CSS, SCSS Modules, shadcn/ui
- **Key Integrations**: Spotify Web API, Spotify Web Playback SDK, Contentful CMS
- **State Management**: React Context API + SWR for data fetching

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

## Styling

### Tailwind + SCSS Modules
- Use **Tailwind CSS** for utility-first styling
- Use **SCSS modules** for component-specific complex styles
- Never mix global CSS classes with scoped modules

### Design System
- Primary brand color: `#3d38f5` (purple)
- Secondary: `#8b87ff` (light purple)
- Follow mobile-first responsive design
- Light/dark mode support via Theme context

### shadcn/ui Components
- Only use `/components/ui/` for shadcn/ui components
- Never create custom components in this folder
- Import shadcn components as needed via CLI

## Performance & Optimization

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
