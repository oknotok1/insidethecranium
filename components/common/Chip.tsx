import React from "react";

/**
 * Unified Chip Component (2026 Design System)
 * 
 * A consistent badge/tag component used across the site for categories, genres, tags, etc.
 * 
 * Features:
 * - Consistent sizing and spacing
 * - Subtle backgrounds with proper contrast
 * - Dark mode support
 * - Flexible variants (default, primary, etc.)
 */

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "primary";
  className?: string;
}

const variants = {
  default: "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400",
  primary: "bg-[#3d38f5]/10 dark:bg-[#3d38f5]/20 text-[#3d38f5] dark:text-[#8b87ff]",
};

export function Chip({ children, variant = "default", className = "" }: ChipProps) {
  const variantClasses = variants[variant];
  
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs leading-none rounded-md ${variantClasses} ${className}`.trim()}
    >
      {children}
    </span>
  );
}

// Desktop-specific chip with larger padding (used in some components)
export function ChipLarge({ children, variant = "default", className = "" }: ChipProps) {
  const variantClasses = variants[variant];
  
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 text-xs leading-none rounded-full ${variantClasses} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
