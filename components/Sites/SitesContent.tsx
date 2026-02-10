"use client";

import { useState } from "react";

import {
  getAllSitesInOrder,
  getAllTags,
  getFeaturedSites,
  getSitesByTag,
  type SiteTag,
} from "@/data/sites";

import SiteCard from "./SiteCard";

export default function SitesContent() {
  const [selectedTag, setSelectedTag] = useState<SiteTag | "All" | "Featured">(
    "All",
  );
  const tags = getAllTags();
  const allSites = getAllSitesInOrder();
  const featuredSites = getFeaturedSites();

  // Get filtered sites based on selected tag
  const filteredSites =
    selectedTag === "All"
      ? allSites
      : selectedTag === "Featured"
        ? featuredSites
        : getSitesByTag(selectedTag);

  // Sites are already sorted by the helper functions according to recommendedSitesOrder
  const displayedSites = filteredSites;

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
          <button
            onClick={() => setSelectedTag("All")}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-base ${
              selectedTag === "All"
                ? "scale-105 text-white shadow-lg"
                : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
            style={
              selectedTag === "All" ? { backgroundColor: "#3d38f5" } : undefined
            }
          >
            All
            <span className="ml-1.5 opacity-75">({allSites.length})</span>
          </button>
          <button
            onClick={() => setSelectedTag("Featured")}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-base ${
              selectedTag === "Featured"
                ? "scale-105 text-white shadow-lg"
                : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
            }`}
            style={
              selectedTag === "Featured"
                ? { backgroundColor: "#3d38f5" }
                : undefined
            }
          >
            Featured
            <span className="ml-1.5 opacity-75">({featuredSites.length})</span>
          </button>
          {tags.map((tag) => {
            const count = getSitesByTag(tag).length;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-5 sm:py-2.5 sm:text-base ${
                  selectedTag === tag
                    ? "scale-105 text-white shadow-lg"
                    : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
                style={
                  selectedTag === tag
                    ? { backgroundColor: "#3d38f5" }
                    : undefined
                }
              >
                {tag}
                <span className="ml-1.5 opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {displayedSites.map((site, index) => (
          <SiteCard
            key={site.id}
            site={site}
            loadDelay={index * 500} // Stagger by 500ms per site
          />
        ))}
      </div>

      {/* Empty State */}
      {displayedSites.length === 0 && (
        <div className="py-16 text-center sm:py-20">
          <div className="mx-auto max-w-md">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No sites found in this category.
            </p>
            <button
              onClick={() => setSelectedTag("All")}
              className="mt-6 rounded-full border border-gray-200 bg-gray-100 px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-200 hover:text-gray-900 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              View All Sites
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
