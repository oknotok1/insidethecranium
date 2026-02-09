"use client";

import { X, ExternalLink, Star } from "lucide-react";
import { useEffect } from "react";
import SiteImage from "./SiteImage";
import type { RecommendedSite } from "@/data/sites";

interface SiteModalProps {
  site: RecommendedSite;
  isOpen: boolean;
  onClose: () => void;
}

export default function SiteModal({ site, isOpen, onClose }: SiteModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {/* Featured Badge */}
        {site.featured && (
          <div className="absolute top-4 left-4 z-20">
            <div
              className="p-2 rounded-full backdrop-blur-sm"
              style={{ backgroundColor: "rgba(61, 56, 245, 0.9)" }}
            >
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Image Header */}
        <div className="shrink-0">
          <SiteImage url={site.url} name={site.name} customImageUrl={site.imageUrl} preferFavicon={site.preferFavicon} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {site.name}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {site.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Full Description */}
          <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 mb-8">
            {site.description}
          </p>

          {/* Action Button */}
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: "#3d38f5" }}
            onClick={(e) => e.stopPropagation()}
          >
            <span>Visit {site.name}</span>
            <ExternalLink className="w-5 h-5" />
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
