import React from "react";
import Link from "next/link";

/**
 * Unified Card Component (2026 Design System)
 * 
 * A flexible card wrapper that follows the site's unified design language.
 * Supports multiple element types (div, Link, button, anchor) with consistent styling.
 * 
 * Features:
 * - Subtle borders that become more visible on hover
 * - Scale and shadow hover effects
 * - Smooth transitions
 * - Dark mode support
 * - Flexible content layout
 */

interface BaseCardProps {
  children: React.ReactNode;
  className?: string;
}

interface DivCardProps extends BaseCardProps {
  as?: "div";
}

interface LinkCardProps extends BaseCardProps {
  as: "link";
  href: string;
}

interface ButtonCardProps extends BaseCardProps {
  as: "button";
  onClick?: () => void;
}

interface AnchorCardProps extends BaseCardProps {
  as: "anchor";
  href: string;
  target?: string;
  rel?: string;
}

type CardProps = DivCardProps | LinkCardProps | ButtonCardProps | AnchorCardProps;

const baseClasses =
  "group relative flex flex-col overflow-hidden bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-50 dark:border-white/[0.025] hover:border-gray-100 dark:hover:border-white/5 rounded-lg shadow-card transition-all duration-300";

export function Card({ children, className = "", ...props }: CardProps) {
  const combinedClasses = `${baseClasses} ${className}`.trim();

  if (!props.as || props.as === "div") {
    return <div className={combinedClasses}>{children}</div>;
  }

  if (props.as === "link") {
    const { href } = props as LinkCardProps;
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  if (props.as === "button") {
    const { onClick } = props as ButtonCardProps;
    return (
      <button onClick={onClick} className={`${combinedClasses} w-full text-left`}>
        {children}
      </button>
    );
  }

  if (props.as === "anchor") {
    const { href, target, rel } = props as AnchorCardProps;
    return (
      <a href={href} target={target} rel={rel} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return <div className={combinedClasses}>{children}</div>;
}

// Specific card variants for convenience
export function InteractiveCard({ children, className = "", onClick }: BaseCardProps & { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`${baseClasses} cursor-pointer ${className}`.trim()}
    >
      {children}
    </div>
  );
}
