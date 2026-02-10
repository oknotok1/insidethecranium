"use client";

import {
  getAllSitesInOrder,
  getAllTags,
  getFeaturedSites,
  getSitesByTag,
  type SiteTag,
} from "@/data/sites";

import { useState } from "react";

import SiteCard from "@/components/Sites/SiteCard";

type FilterType = SiteTag | "All" | "Featured";

// Helper to get filtered sites based on selected tag
const getFilteredSites = (
  filter: FilterType,
  allSites: ReturnType<typeof getAllSitesInOrder>,
  featuredSites: ReturnType<typeof getFeaturedSites>,
) => {
  if (filter === "All") return allSites;
  if (filter === "Featured") return featuredSites;
  return getSitesByTag(filter);
};

export default function SitesClient() {
  const [selectedTag, setSelectedTag] = useState<FilterType>("All");
  const tags = getAllTags();
  const allSites = getAllSitesInOrder();
  const featuredSites = getFeaturedSites();

  const displayedSites = getFilteredSites(selectedTag, allSites, featuredSites);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="mb-4 text-3xl sm:mb-6 sm:text-4xl md:text-5xl">
          Recommended Sites
        </h1>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          My favorite platforms for discovering and exploring music. From
          streaming services to analytics tools, these sites have shaped my
          musical journey.
        </p>
      </div>

      {/* Tag Filter */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <FilterButton
            label="All"
            count={allSites.length}
            isSelected={selectedTag === "All"}
            onClick={() => setSelectedTag("All")}
          />
          <FilterButton
            label="Featured"
            count={featuredSites.length}
            isSelected={selectedTag === "Featured"}
            onClick={() => setSelectedTag("Featured")}
          />
          {tags.map((tag) => (
            <FilterButton
              key={tag}
              label={tag}
              count={getSitesByTag(tag).length}
              isSelected={selectedTag === tag}
              onClick={() => setSelectedTag(tag)}
            />
          ))}
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {displayedSites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>

      {/* Empty State */}
      {displayedSites.length === 0 && (
        <EmptyState onViewAll={() => setSelectedTag("All")} />
      )}
    </div>
  );
}

// Filter button component
const FilterButton = ({
  label,
  count,
  isSelected,
  onClick,
}: {
  label: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-base ${
      isSelected
        ? "scale-105 bg-[#3d38f5] text-white shadow-lg"
        : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
    }`}
  >
    {label}
    <span className="ml-1.5 opacity-75">({count})</span>
  </button>
);

// Empty state component
const EmptyState = ({ onViewAll }: { onViewAll: () => void }) => (
  <div className="py-16 text-center sm:py-20">
    <div className="mx-auto max-w-md">
      <p className="text-lg text-gray-600 dark:text-gray-400">
        No sites found in this category.
      </p>
      <button
        onClick={onViewAll}
        className="mt-6 rounded-full border border-gray-200 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-200 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
      >
        View All Sites
      </button>
    </div>
  </div>
);
