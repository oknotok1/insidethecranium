'use server';

import { revalidateTag } from 'next/cache';

/**
 * Invalidate recently played cache when track changes
 * Uses stale-while-revalidate for better UX
 */
export async function invalidateRecentlyPlayed() {
  console.log('[Server Action] Invalidating recently-played cache');
  revalidateTag('recently-played', 'max');
}

/**
 * Invalidate playlists cache (for when user adds/removes playlists)
 * Uses stale-while-revalidate for better UX
 */
export async function invalidatePlaylists() {
  console.log('[Server Action] Invalidating playlists cache');
  revalidateTag('playlists', 'max');
}
