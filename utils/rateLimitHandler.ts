/**
 * Rate Limit Handling Utilities for Spotify API
 */

// Constants
const RATE_LIMIT_THRESHOLD = 60; // seconds
const MAX_RETRY_DELAY = 10; // seconds
const SECONDS_TO_MS = 1000;

// Helper functions
const formatRetryMinutes = (seconds: number): string =>
  (seconds / 60).toFixed(1);

const calculateRetryTime = (seconds: number): string => {
  const retryDate = new Date(Date.now() + seconds * SECONDS_TO_MS);
  return retryDate.toLocaleString("en-US", {
    timeZone: "Asia/Singapore",
    hour12: false,
  });
};

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
  maxRetries: number,
): RateLimitResult {
  const retryMinutes = formatRetryMinutes(retryAfterSeconds);
  const retryAvailableTime = calculateRetryTime(retryAfterSeconds);

  // If rate limit exceeds threshold, skip retries
  if (retryAfterSeconds > RATE_LIMIT_THRESHOLD) {
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

  const cappedRetryAfter = Math.min(retryAfterSeconds, MAX_RETRY_DELAY);

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
  await new Promise((resolve) => setTimeout(resolve, seconds * SECONDS_TO_MS));
}
