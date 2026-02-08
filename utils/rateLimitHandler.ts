/**
 * Rate Limit Handling Utilities for Spotify API
 */

export interface RateLimitResult {
  shouldRetry: boolean;
  retryAfter: number; // in seconds
  message: string;
}

/**
 * Determines if we should retry based on Spotify's rate limit response
 * @param retryAfterSeconds - Retry-After header value in seconds
 * @param retryCount - Current retry attempt
 * @param maxRetries - Maximum retry attempts allowed
 * @returns RateLimitResult with retry decision and details
 */
export function shouldRetryRateLimit(
  retryAfterSeconds: number,
  retryCount: number,
  maxRetries: number
): RateLimitResult {
  const retryMinutes = (retryAfterSeconds / 60).toFixed(1);
  
  // Calculate when the rate limit will expire
  const retryAvailableAt = new Date(Date.now() + retryAfterSeconds * 1000);
  const retryAvailableTime = retryAvailableAt.toLocaleString('en-US', {
    timeZone: 'Asia/Singapore',
    hour12: false,
  });

  // If rate limit > 60s, we're deeply rate limited - skip retries
  if (retryAfterSeconds > 60) {
    return {
      shouldRetry: false,
      retryAfter: 0,
      message: `Rate limit too high (${retryAfterSeconds}s / ${retryMinutes}m / available at ${retryAvailableTime}), skipping retries`,
    };
  }

  // Check if we've exceeded max retries
  if (retryCount >= maxRetries) {
    return {
      shouldRetry: false,
      retryAfter: 0,
      message: `Max retries (${maxRetries}) reached`,
    };
  }

  // Cap retry delay at 10 seconds for shorter rate limits
  const cappedRetryAfter = Math.min(retryAfterSeconds, 10);

  return {
    shouldRetry: true,
    retryAfter: cappedRetryAfter,
    message: `Spotify says wait ${retryAfterSeconds}s (${retryMinutes}m / available at ${retryAvailableTime}), using ${cappedRetryAfter}s (attempt ${retryCount + 1}/${maxRetries})`,
  };
}

/**
 * Waits for the specified duration
 * @param seconds - Duration to wait in seconds
 */
export async function waitForRetry(seconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
