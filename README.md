# Inside The Cranium

A full-stack personal music showcase integrating Spotify's Web API with Next.js 16, featuring real-time playback status, smart caching strategies, and an admin dashboard.

## Overview

Personal project demonstrating modern web development practices with server-side rendering, API integration, and production-ready optimization strategies. Built to handle Spotify's rate limits while maintaining real-time data synchronization.

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + SCSS Modules
- **APIs**: Spotify Web API, Contentful CMS
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
Now Playing                         → Cache: None (real-time)
Recently Played                     → Cache: Indefinite (on-demand revalidation)
```

#### Admin Dashboard

- Password-protected cache management interface
- Manual cache purging with tag-specific revalidation
- OAuth token refresh helper for Spotify API

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

### Monorepo Structure

Organized by feature with clear separation between server/client components, utilities, and API routes for better maintainability and scalability.

## Performance Metrics

- **Build Time**: ~5-6 seconds (optimized with Turbopack)
- **API Calls**: Reduced from ~150/page to <10/page through caching
- **Cache Hit Rate**: 90%+ on repeat visits
- **Rate Limit Handling**: 10-second max retry delay (vs. Spotify's 60+ minute suggestions)

## Development

```bash
yarn install
yarn dev    # Development server on localhost:3000
yarn build  # Production build
```

Requires environment variables for Spotify API credentials and Contentful CMS (see Vercel deployment settings).

---

**Live Demo**: [insidethecranium.vercel.app](https://insidethecranium.vercel.app) (if deployed)
