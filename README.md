# Inside The Cranium

A full-stack personal music showcase integrating Spotify's Web API with Next.js 16, featuring real-time playback status, smart caching strategies, and a secure admin dashboard.

## Overview

Personal project demonstrating modern web development practices with server-side rendering, API integration, and production-ready optimization strategies. Built to handle Spotify's rate limits while maintaining real-time data synchronization.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router, React Server Components, Turbopack)
- **Runtime**: Node.js 24.x
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + SCSS Modules
- **State Management**: React Context + SWR
- **APIs**: Spotify Web API, Spotify Web Playback SDK, Contentful CMS
- **Deployment**: Vercel (Edge Functions + Serverless)

## Key Features

### 🎵 Real-Time Music Integration

- Live "Now Playing" status with Spotify Web Playback SDK
- Dynamic playlist exploration with genre categorization
- Artist metadata aggregation from multiple API sources
- Smooth client-side polling with SWR (stale-while-revalidate)

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
```

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
- **Utilities**: Shared logic (`/utils/`) with DRY principles
- **API Routes**: Grouped by service (`/app/api/spotify/`, `/app/api/contentful/`)
- **Component Co-location**: Page-specific components live with their pages
- **Shared Components**: Reusable UI in `/components/common/`

## Performance Metrics

- **Build Time**: ~7-10 seconds (with Turbopack)
- **TypeScript Check**: ~2 seconds
- **API Calls**: Reduced from ~150/page to <10/page through caching
- **Cache Hit Rate**: 90%+ on repeat visits
- **Rate Limit Handling**: 10-second max retry delay (vs. Spotify's 60+ minute suggestions)
- **Image Optimization**: Next.js Image with AVIF/WebP, 30-day cache TTL

## Development

```bash
yarn install
yarn dev    # Development server on localhost:3000
yarn build  # Production build
```

Requires environment variables for Spotify API and Contentful CMS. Configure these in your Vercel dashboard or local `.env.local` file.

## Project Conventions

- **TypeScript**: Strict mode, no `any` types, arrow functions preferred
- **Imports**: Path aliases (`@/`) for all non-local imports
- **Styling**: Tailwind for utilities, SCSS modules for complex components
- **Types**: Organized by API source (`types/spotify.ts`, `types/contentful.ts`)
- **Caching**: Route segment config requires literal values (Next.js 16 requirement)

---

**Live Demo**: [insidethecranium.io](https://insidethecranium.io)
