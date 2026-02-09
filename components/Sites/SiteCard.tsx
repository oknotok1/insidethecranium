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
          <div className="absolute top-3 right-3 z-10">
            <div
              className="p-1 rounded-full backdrop-blur-sm"
              style={{ backgroundColor: "rgba(61, 56, 245, 0.9)" }}
            >
              <Star className="w-3.5 h-3.5 text-white fill-white" />
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

        {/* Content - M3 spacing: 8dp base unit (2 in Tailwind) */}
        <div className="flex-1 flex flex-col p-4">
          {/* Title - M3: 16sp */}
          <h3 className="font-semibold text-base leading-tight text-gray-900 dark:text-white group-hover:text-[#3d38f5] dark:group-hover:text-[#8b87ff] transition-colors line-clamp-1 mb-2">
            {site.name}
          </h3>

          {/* Description - M3: 14sp, 8dp spacing from title */}
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
            {site.description}
          </p>

          {/* Tags - M3: 12dp spacing from description, 8dp gap between chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {site.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs leading-none px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* URL Footer - M3: 12sp, 12dp spacing from tags */}
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-white/10 group/link"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs text-gray-500 dark:text-gray-500 group-hover/link:text-[#3d38f5] dark:group-hover/link:text-[#8b87ff] transition-colors truncate flex-1">
              {new URL(site.url).hostname.replace("www.", "")}
            </span>
            <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover/link:text-[#3d38f5] dark:group-hover/link:text-[#8b87ff] group-hover/link:translate-x-1 transition-all shrink-0 ml-2" />
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
