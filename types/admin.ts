/**
 * Admin-specific TypeScript types
 * Shared across admin components for error handling, forms, etc.
 */

// Contentful validation error structure (internal use only)
interface ContentfulValidationError {
  errors?: Array<{
    path?: string[];
    details?: string;
    message?: string;
    value?: unknown;
  }>;
}

// Error stack structure (internal use only)
interface ErrorStackDetails {
  stack?: string;
}

// Union type for all possible error detail shapes
export type ErrorDetails =
  | ContentfulValidationError
  | ErrorStackDetails
  | Record<string, unknown>
  | null
  | undefined;

// Standard error state interface used across admin components
export interface ErrorState {
  message: string;
  details?: ErrorDetails;
  timestamp: string;
}

// Type guard to check if details is a Contentful validation error
export function isContentfulValidationError(
  details: ErrorDetails
): details is ContentfulValidationError {
  return (
    details !== null &&
    details !== undefined &&
    typeof details === "object" &&
    "errors" in details &&
    Array.isArray(details.errors)
  );
}
