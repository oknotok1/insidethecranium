# Inside The Cranium

A full-stack personal music showcase integrating Spotify's Web API with Next.js 16, featuring real-time playback status, smart caching strategies, and a secure admin dashboard.

## Overview

Personal project demonstrating modern web development practices with server-side rendering, API integration, and production-ready optimization strategies. Built to handle Spotify's rate limits while maintaining real-time data synchronization.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, React Server Components, Turbopack)
- **Runtime**: Node.js 24.x
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + SCSS Modules
- **UI Components**: Radix UI + Shadcn (Drawer, Popover), Sonner (Toast)
- **State Management**: React Context + SWR
- **APIs**: Spotify Web API, YouTube Data API v3, Contentful CMS
- **Media Playback**: YouTube IFrame Player API
- **Deployment**: Vercel (Edge Functions + Serverless)

## Key Features

### 🎵 Real-Time Music Integration

- Live "Now Playing" status with Spotify Web Playback SDK
- **In-App Music Preview Player**: YouTube-powered playback with desktop mini player and mobile drawer
- Dynamic playlist exploration with genre categorization
- Artist metadata aggregation from multiple API sources
- Smooth client-side polling with SWR (stale-while-revalidate)

### 🎮 Interactive Music Player

#### Desktop Experience
- **Mini Player**: Fixed-position player with minimize/expand animations
- **Auto-Minimize**: 5-second countdown on first play with interactive hover controls
- **Toast Notifications**: Album artwork and track info when minimized
- **Playback Controls**: Play/pause sync across all track cards
- **Smart State Management**: Persists playback across page navigation

#### Mobile Experience
- **Drawer Player**: Swipe-to-dismiss with smooth animations
- **Responsive Controls**: Touch-optimized playback interface
- **Error Handling**: Automatic dismissal with helpful Spotify fallback links
- **Safe Area Support**: Dynamic viewport height (dvh) for notch compatibility

#### Universal Features
- **YouTube Integration**: Automatic video search with 24-hour server-side caching
- **State Synchronization**: Real-time playback state across all UI elements
- **Click-to-Play**: Interactive album artwork and track cards throughout the app
- **Progress Tracking**: Real-time progress bars in Now Playing popover
- **Spotify Links**: Quick access to full tracks on Spotify

### ⚡ Performance Optimizations

- **Aggressive Server-Side Caching**: Next.js Data Cache with indefinite TTL for static content
- **Smart Revalidation**: Tag-based cache invalidation with on-demand purging
- **Rate Limit Handling**:
  - Exponential backoff with capped retry delays
  - Fail-fast strategy for deep rate limits (>60s)
  - Sequential batch processing to prevent concurrent API hammering
- **ISR (Incremental Static Regeneration)**: 24-hour revalidation for semi-static pages

### 🛠️ Engineering Highlights

#### API Architecture

- Centralized utility functions following DRY principles
- Shared rate limit handler across all Spotify endpoints
- Unified logging system with GMT+8 timestamped output
- Type-safe error handling with graceful degradation

#### Caching Strategy

```
Static Data (Tracks/Artists/Genres) → Cache: Indefinite
Access Tokens                       → Cache: 50 minutes
User Playlists                      → Cache: 24 hours
Now Playing                         → Cache: None (real-time SWR polling)
Recently Played                     → Cache: Indefinite
Curated Tracks                      → Cache: Indefinite
YouTube Video IDs                   → Cache: 24 hours (server) + In-memory (client)
```

**Multi-Layer YouTube Caching**:
- **Client-side**: In-memory Map for instant repeat searches
- **Server-side**: Next.js fetch cache with 24-hour revalidation
- **Result**: Zero redundant YouTube Data API calls

#### Admin Dashboard

A secure management interface for maintaining cache freshness:

- **Cache Revalidation System**: Tag-specific and bulk cache invalidation with real-time feedback
- **Refresh Tracking**: Individual timestamps per cache tag showing last refresh time
- **Revalidation History**: Server-side activity log of cache management operations (last 100 events)
- **Build Information**: Deployment timestamp visibility for cache lifecycle tracking
- **Spotify OAuth Helper**: Utilities for managing Spotify API token refresh
- **Responsive Design**: Mobile-optimized interface with hover states and smooth interactions

### 🎨 UI/UX Features

- System-aware dark mode with smooth transitions
- Responsive design (mobile-first approach)
- Scrolling marquee animations for overflowing text
- Real-time playback controls and status indicators
- **Interactive Track Cards**: Unified play button overlays with hover states
- **Now Playing Popover**: Album artwork with playback control, progress bar, and timestamps
- **Toast Notifications**: Glassmorphism-inspired design matching theme
- **Accessibility**: ARIA labels, keyboard navigation, and semantic HTML throughout

## Architecture Decisions

### Why Server Components?

Moved data fetching to RSC to leverage Next.js Data Cache and reduce client bundle size. This enabled better cache control and eliminated the need for state management libraries.

### Rate Limit Mitigation

Implemented a multi-layered approach:

1. **Cache Layer**: Minimize API calls through aggressive caching
2. **Retry Logic**: Smart exponential backoff with 60-second threshold
3. **Sequential Processing**: Batch requests with 500ms delays
4. **Fail Fast**: Skip retries for deep rate limits to prevent timeouts

### Project Structure

Organized by feature with clear separation:

- **Server Components**: Default for data fetching (pages, layouts)
- **Client Components**: Interactive UI (`"use client"` directive)
- **Contexts**: Global state management (`/contexts/`) - Preview player, app state
- **Hooks**: Custom React hooks (`/hooks/`) - YouTube search, media queries
- **Utilities**: Shared logic (`/utils/`) with DRY principles
- **API Routes**: Grouped by service (`/app/api/spotify/`, `/app/api/youtube/`, `/app/api/contentful/`)
- **Component Co-location**: Page-specific components live with their pages
- **Shared Components**: Reusable UI (`/components/`) - Player, Layout, Music cards
- **UI Components**: Shadcn primitives (`/components/ui/`) - Drawer, Popover, Toast

## Performance Metrics

- **Build Time**: ~7-10 seconds (with Turbopack)
- **TypeScript Check**: ~2 seconds
- **API Calls**: Reduced from ~150/page to <10/page through caching
- **Cache Hit Rate**: 90%+ on repeat visits
- **Rate Limit Handling**: 10-second max retry delay (vs. Spotify's 60+ minute suggestions)
- **Image Optimization**: Next.js Image with AVIF/WebP, 30-day cache TTL
- **YouTube Search**: <50ms response time (cached), ~500ms (cold)

## Technical Implementation

### Preview Player Architecture

**Why YouTube Instead of Spotify Previews?**
- Spotify preview URLs (30-second clips) were deprecated
- YouTube provides full tracks with better availability
- Embedded player offers familiar, cross-platform UX

**State Management Pattern**
```typescript
PreviewPlayerContext (Global State)
    ↓
DesktopMiniPlayer / MobileDrawerPlayer
    ↓
YouTubePlayer (IFrame API)
    ↓
Synced Playback State → All Track Cards
```

**Component Lifecycle**
1. User clicks track → YouTube search API (cached)
2. Video ID returned → Player component mounts
3. YouTube IFrame API initializes → Autoplay attempts
4. State sync → UI updates across all components
5. Error handling → Automatic dismissal + Spotify fallback

**Key Design Patterns**
- **Single Source of Truth**: React Context for player state
- **Optimistic Updates**: UI responds immediately, syncs later
- **Graceful Degradation**: Fallback to Spotify links on errors
- **Clean Unmounting**: Player fully destroys on close for fresh state
- **Accessibility First**: ARIA labels, keyboard nav, semantic HTML

## Development

```bash
yarn install
yarn dev    # Development server on localhost:3000
yarn build  # Production build
```

Requires environment variables for Spotify API, YouTube Data API, and Contentful CMS. Configure these in your Vercel dashboard or local `.env.local` file.

## Project Conventions

- **TypeScript**: Strict mode, minimal `any` types, arrow functions preferred
- **Imports**: Path aliases (`@/`) for all non-local imports
- **Styling**: Tailwind for utilities, SCSS modules for complex components
- **Types**: Organized by API source (`types/spotify.ts`, `types/contentful.ts`)
- **Caching**: Route segment config requires literal values (Next.js 16 requirement)
- **State Management**: React Context for global state, component state for local UI
- **Error Handling**: Toast notifications for user-facing errors, console for debugging
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation on all interactive elements
- **Component Patterns**: Compound components for complex UI (Drawer, Popover)

---

**Live Demo**: [insidethecranium.io](https://insidethecranium.io)
