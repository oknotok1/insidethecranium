"use client";

import { ExternalLink, Star, X } from "lucide-react";
import type { RecommendedSite } from "@/data/sites";

import { useEffect } from "react";

import SiteImage from "./SiteImage";

// Helper to handle escape key press
const useEscapeKey = (isOpen: boolean, onClose: () => void) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);
};

export default function SiteModal({
  site,
  isOpen,
  onClose,
}: {
  site: RecommendedSite;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full border border-gray-200 bg-white/90 p-2 transition-all duration-300 hover:scale-110 hover:bg-white dark:border-white/10 dark:bg-black/90 dark:hover:bg-black"
          aria-label="Close modal"
        >
          <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Featured Badge */}
        {site.featured && (
          <div className="absolute top-4 left-4 z-20">
            <div className="rounded-full bg-[#3d38f5]/90 p-2 backdrop-blur-sm">
              <Star className="h-4 w-4 fill-white text-white" />
            </div>
          </div>
        )}

        {/* Image Header */}
        <div className="shrink-0">
          <SiteImage
            url={site.url}
            name={site.name}
            customImageUrl={site.imageUrl}
            preferFavicon={site.preferFavicon}
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Title */}
          <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            {site.name}
          </h2>

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            {site.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Full Description */}
          <p className="mb-8 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {site.description}
          </p>

          {/* Action Button */}
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center space-x-2 rounded-full bg-[#3d38f5] px-6 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <span>Visit {site.name}</span>
            <ExternalLink className="h-5 w-5" />
          </a>

          {/* URL */}
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
            {site.url}
          </p>
        </div>
      </div>
    </div>
  );
}
