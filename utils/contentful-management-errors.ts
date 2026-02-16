/**
 * Helper to detect if error is due to expired/invalid token
 */
export function isTokenExpiredError(error: any): boolean {
  if (!error) return false;

  const errorMessage = error.message?.toLowerCase() || "";
  const errorString = error.toString().toLowerCase();

  // Common error patterns for expired/invalid tokens
  const tokenErrorPatterns = [
    "unauthorized",
    "401",
    "invalid token",
    "expired token",
    "token has expired",
    "authentication failed",
    "access token",
    "cfpat",
  ];

  return tokenErrorPatterns.some(
    (pattern) =>
      errorMessage.includes(pattern) || errorString.includes(pattern),
  );
}

/**
 * Get user-friendly error message
 */
export function getManagementErrorMessage(error: any): string {
  if (isTokenExpiredError(error)) {
    return "TOKEN_EXPIRED";
  }

  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
}
