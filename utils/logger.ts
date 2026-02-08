/**
 * Logging Utilities with GMT+8 Timestamps
 */

/**
 * Gets current timestamp in GMT+8 (Asia/Singapore timezone)
 * @returns Formatted timestamp string
 */
export function getTimestampGMT8(): string {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Singapore',
    hour12: false,
  });
}

/**
 * Logs with GMT+8 timestamp prefix
 */
export const logger = {
  log: (context: string, message: string) => {
    console.log(`[${getTimestampGMT8()} GMT+8] [${context}] ${message}`);
  },

  warn: (context: string, message: string) => {
    console.warn(`[${getTimestampGMT8()} GMT+8] [${context}] ⚠ ${message}`);
  },

  error: (context: string, message: string) => {
    console.error(`[${getTimestampGMT8()} GMT+8] [${context}] ✗ ${message}`);
  },

  success: (context: string, message: string) => {
    console.log(`[${getTimestampGMT8()} GMT+8] [${context}] ✓ ${message}`);
  },
};
