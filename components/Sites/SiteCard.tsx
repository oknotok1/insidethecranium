"use client";

import { useState } from "react";
import { ExternalLink, Star } from "lucide-react";
import SiteImage from "./SiteImage";
import SiteModal from "./SiteModal";
import type { RecommendedSite } from "@/data/sites";
import { InteractiveCard } from "@/components/common/Card";

interface SiteCardProps {
  site: RecommendedSite;
}

export default function SiteCard({ site }: SiteCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <InteractiveCard
        onClick={() => setIsModalOpen(true)}
        className="h-full"
      >
        {/* Featured Badge */}
        {site.featured && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
            <div
              className="p-1 rounded-full backdrop-blur-sm"
              style={{ backgroundColor: "rgba(61, 56, 245, 0.9)" }}
            >
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Image Header - 16:9 aspect ratio with smart fallbacks */}
        <SiteImage 
          url={site.url} 
          name={site.name} 
          customImageUrl={site.imageUrl}
          preferFavicon={site.preferFavicon}
        />

        {/* Content */}
        <div className="flex-1 flex flex-col p-3 sm:p-4">
          {/* Title */}
          <h3 className="font-medium text-sm sm:text-base leading-tight text-gray-900 dark:text-white group-hover:text-[#3d38f5] dark:group-hover:text-[#8b87ff] transition-colors line-clamp-1 mb-2">
            {site.name}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm leading-snug text-gray-600 dark:text-gray-400 line-clamp-3 mb-3 overflow-hidden">
            {site.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-start gap-1.5 sm:gap-2 mb-3 flex-1">
            {site.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs leading-none px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
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
            className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200 dark:border-white/10 group/link"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs text-gray-500 dark:text-gray-500 group-hover/link:text-[#3d38f5] dark:group-hover/link:text-[#8b87ff] transition-colors truncate flex-1">
              {new URL(site.url).hostname.replace("www.", "")}
            </span>
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-600 group-hover/link:text-[#3d38f5] dark:group-hover/link:text-[#8b87ff] group-hover/link:translate-x-1 transition-all shrink-0 ml-2" />
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
