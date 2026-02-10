"use client";

import { useState } from "react";

import type { RecommendedSite } from "@/data/sites";
import { ExternalLink, Star } from "lucide-react";

import { InteractiveCard } from "@/components/common/Card";

import SiteImage from "./SiteImage";
import SiteModal from "./SiteModal";

interface SiteCardProps {
  site: RecommendedSite;
  loadDelay?: number;
}

export default function SiteCard({ site, loadDelay }: SiteCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <InteractiveCard onClick={() => setIsModalOpen(true)} className="h-full">
        {/* Featured Badge */}
        {site.featured && (
          <div className="absolute top-2 right-2 z-10 sm:top-3 sm:right-3">
            <div
              className="rounded-full p-1 backdrop-blur-sm"
              style={{ backgroundColor: "rgba(61, 56, 245, 0.9)" }}
            >
              <Star className="h-3 w-3 fill-white text-white sm:h-3.5 sm:w-3.5" />
            </div>
          </div>
        )}

        {/* Image Header - 16:9 aspect ratio with smart fallbacks */}
        <SiteImage
          url={site.url}
          name={site.name}
          customImageUrl={site.imageUrl}
          preferFavicon={site.preferFavicon}
          loadDelay={loadDelay}
        />

        {/* Content */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {/* Title */}
          <h3 className="mb-2 line-clamp-1 text-sm leading-tight font-medium text-gray-900 transition-colors group-hover:text-[#3d38f5] sm:text-base dark:text-white dark:group-hover:text-[#8b87ff]">
            {site.name}
          </h3>

          {/* Description */}
          <p className="mb-3 line-clamp-3 overflow-hidden text-xs leading-snug text-gray-600 sm:text-sm dark:text-gray-400">
            {site.description}
          </p>

          {/* Tags */}
          <div className="mb-3 flex flex-1 flex-wrap items-start gap-1.5 sm:gap-2">
            {site.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-200 px-2 py-1 text-xs leading-none text-gray-600 transition-colors group-hover:bg-gray-300 dark:bg-white/5 dark:text-gray-400 dark:group-hover:bg-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* URL Footer */}
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link flex items-center justify-between border-t border-gray-200 pt-2 transition-colors group-hover:border-gray-300 sm:pt-3 dark:border-white/10 dark:group-hover:border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex-1 truncate text-xs text-gray-500 transition-colors group-hover/link:text-[#3d38f5] dark:text-gray-400 dark:group-hover/link:text-[#8b87ff]">
              {new URL(site.url).hostname.replace("www.", "")}
            </span>
            <ExternalLink className="ml-2 h-3.5 w-3.5 shrink-0 text-gray-400 transition-all group-hover/link:translate-x-1 group-hover/link:text-[#3d38f5] sm:h-4 sm:w-4 dark:text-gray-600 dark:group-hover/link:text-[#8b87ff]" />
          </a>
        </div>
      </InteractiveCard>

      {/* Modal */}
      <SiteModal
        site={site}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
