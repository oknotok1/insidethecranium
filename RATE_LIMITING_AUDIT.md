# Rate Limiting & Caching Audit Report

**Date**: February 16, 2026  
**Status**: ✅ **ALL PROTECTIONS IN PLACE**

---

## Summary

All rate limiting and caching measures are properly implemented and preserved after refactoring. The centralized `fetchSpotifyWithRetry()` function now includes comprehensive 429 rate limit handling.

---

## 1. Rate Limiting Protection

### A. Centralized Rate Limit Handler (`utils/rateLimitHandler.ts`)

**Constants:**
- `RATE_LIMIT_THRESHOLD`: 60 seconds (won't retry if rate limit exceeds 1 minute)
- `MAX_RETRY_DELAY`: 10 seconds (caps retry delay)
- `MAX_RETRIES`: 3 attempts across all endpoints

**Features:**
- ✅ Respects Spotify's `Retry-After` header
- ✅ Smart decision: skip retries if rate limit > 60s
- ✅ Logs retry timing in SGT timezone
- ✅ Exponential backoff for network errors

### B. Centralized Fetch with Rate Limiting (`utils/spotify.ts`)

**`fetchSpotifyWithRetry()` now handles:**
1. ✅ **401 errors** - Automatic token refresh (once)
2. ✅ **429 errors** - Rate limit retry with smart backoff
3. ✅ **Network errors** - Retry with 1s delay
4. ✅ **Max retries** - Fails gracefully after 3 attempts

**Used by:**
- `app/api/spotify/tracks/route.ts` - Track details
- `app/api/spotify/playlists/route.ts` - User playlists
- `app/playlists/[playlistId]/page.tsx` - Playlist details
- `app/api/spotify/player/recently-played/route.ts` - Recently played (server token only)
- `app/api/spotify/player/currently-playing/route.ts` - Currently playing (server token only)

### C. Artists/Genres Route - Custom Rate Limiting

**`app/api/spotify/artists/genres/route.ts`:**
- ✅ Batched requests (max 50 artists per batch)
- ✅ Sequential processing (one batch at a time)
- ✅ 500ms delay between batches
- ✅ Full 429 retry logic per batch
- ✅ Exponential backoff on errors (2s, 4s, 6s)

**Why custom?** This route receives tokens from calling endpoints and processes multiple batches, requiring batch-level retry logic.

### D. Playlists Route - Genre Fetch Protection

**`app/api/spotify/playlists/route.ts`:**
- ✅ Limits genre fetching to first 30 playlists
- ✅ 100ms delay every 10 playlists
- ✅ Checks for 429 on track fetches
- ✅ Checks for 429 on artist fetches
- ✅ Gracefully degrades (returns playlists without genres on rate limit)

---

## 2. Caching Strategy

### A. Long-Term Caching (Static Content)

**Tracks API** (`/api/spotify/tracks`)
- ✅ `revalidate: false` (cache forever)
- ✅ Tags: `["tracks", "track:{id}"]`
- ✅ Individual track invalidation support

**Artists/Genres API** (`/api/spotify/artists/genres`)
- ✅ `revalidate: false` (cache forever)
- ✅ Tags: `["artist-genres", "artist:{id}"]`
- ✅ Batch and individual artist invalidation

**Playlist Details** (`/playlists/[playlistId]`)
- ✅ `revalidate: false` (cache indefinitely)
- ✅ Tags: `["playlists", "playlist:{id}"]`

### B. 24-Hour Caching (Semi-Static)

**Playlists API** (`/api/spotify/playlists`)
- ✅ `revalidate: 86400` (24 hours)
- ✅ Tags: `["playlists", "user-playlists:{userId}"]`
- ✅ Daily rebuild keeps content fresh

**Playlist Tracks** (within playlists route)
- ✅ `revalidate: 86400` (24 hours)
- ✅ Tags: `["playlist-tracks:{playlistId}"]`

### C. 50-Minute Caching (Token)

**Auth Token** (`/api/spotify/auth/token`)
- ✅ `revalidate: 3000` (50 minutes)
- ✅ Cached token (expires in 60 min, 10 min safety margin)

### D. No Caching (Real-Time Data)

**Currently Playing** (`/api/spotify/player/currently-playing`)
- ✅ `revalidate: 0` (no cache)
- ✅ `cache: "no-store"` for client requests

**Recently Played** (`/api/spotify/player/recently-played`)
- ✅ `revalidate: false` with manual invalidation
- ✅ Tags: `["recently-played"]`
- ✅ Cache invalidated when track changes

### E. OAuth Endpoints

**Auth Callback & Exchange**
- ✅ `cache: "no-store"` (never cache OAuth flows)

---

## 3. Additional Protections

### A. Request Throttling

**Artists/Genres:**
- Sequential batch processing
- 500ms delay between batches
- 100ms delay every 10 playlists (in playlists route)

### B. Smart Degradation

**Playlists with Genres:**
- If rate limited on tracks: stops fetching genres, returns playlists without genres
- If rate limited on artists: stops fetching genres, returns playlists without genres
- User still gets playlists, just without genre data

### C. Error Handling

**All endpoints:**
- ✅ Graceful fallbacks (empty arrays, null data)
- ✅ Detailed logging for debugging
- ✅ Proper HTTP status codes returned
- ✅ Never crash - always return valid response

---

## 4. Rate Limit Testing Checklist

- [x] 401 token expiration handled
- [x] 429 rate limits handled
- [x] Retry-After header respected
- [x] Max retries enforced (3 attempts)
- [x] Rate limit threshold enforced (60s)
- [x] Network errors retried
- [x] Exponential backoff on errors
- [x] Batch processing with delays
- [x] Cache tags for selective invalidation
- [x] Proper cache revalidation times
- [x] OAuth flows never cached
- [x] Real-time data not cached
- [x] Static content cached forever

---

## 5. Monitoring Recommendations

### Watch for these log patterns:

**Rate Limiting:**
```
[Context] ⚠ Spotify says wait Xs (Xm / available at XX:XX:XX), using Xs (attempt X/3)
[Context] ✗ Rate limit too high (Xs / Xm / available at XX:XX:XX), skipping retries
```

**Token Expiration:**
```
[Context] ⚠ Token expired, fetching fresh token and retrying
[Context] ✗ Failed to refresh token
```

**Graceful Degradation:**
```
[Playlists API] ⚠ Rate limited while fetching tracks, stopping genre fetch
[Artists API] ⚠ Rate limited while fetching artists, stopping genre fetch
```

---

## 6. Best Practices Followed

✅ **Single Source of Truth**: Centralized rate limiting in `fetchSpotifyWithRetry()`  
✅ **Defense in Depth**: Multiple layers (caching, throttling, retries, degradation)  
✅ **Respect API Limits**: Honor Retry-After headers  
✅ **Smart Retries**: Don't retry if rate limit > 60s  
✅ **Batch Processing**: Sequential with delays to avoid bursts  
✅ **Cache Aggressively**: Static content cached forever  
✅ **Cache Strategically**: Different TTLs for different data types  
✅ **Fail Gracefully**: Always return valid responses  
✅ **Log Everything**: Comprehensive logging for debugging  
✅ **Type Safety**: Full TypeScript types for all responses  

---

## Conclusion

**All rate limiting and caching protections are in place and working correctly.** The refactoring maintained all existing safeguards while centralizing the logic for better maintainability.

**Zero rate limit violations expected under normal operation.**
