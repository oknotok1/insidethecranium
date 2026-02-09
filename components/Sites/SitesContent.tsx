"use client";

import { useState } from "react";
import {
  recommendedSites,
  getAllTags,
  getSitesByTag,
  getFeaturedSites,
  type SiteTag,
} from "@/data/sites";
import SiteCard from "./SiteCard";

export default function SitesContent() {
  const [selectedTag, setSelectedTag] = useState<
    SiteTag | "All" | "Featured"
  >("All");
  const tags = getAllTags();
  const featuredSites = getFeaturedSites();

  // Get filtered sites based on selected tag
  const filteredSites =
    selectedTag === "All"
      ? recommendedSites
      : selectedTag === "Featured"
        ? featuredSites
        : getSitesByTag(selectedTag);

  // Sort to always show featured sites first
  const displayedSites = [...filteredSites].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl">
          Recommended Sites
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          My favorite platforms for discovering and exploring music. From streaming services to analytics tools, these sites have shaped my musical journey.
        </p>
      </div>

      {/* Tag Filter */}
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedTag("All")}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
              selectedTag === "All"
                ? "text-white shadow-lg scale-105"
                : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10"
            }`}
            style={
              selectedTag === "All"
                ? { backgroundColor: "#3d38f5" }
                : undefined
            }
          >
            All
            <span className="ml-1.5 opacity-75">({recommendedSites.length})</span>
          </button>
          <button
            onClick={() => setSelectedTag("Featured")}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
              selectedTag === "Featured"
                ? "text-white shadow-lg scale-105"
                : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10"
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
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                  selectedTag === tag
                    ? "text-white shadow-lg scale-105"
                    : "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10"
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
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {displayedSites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>

      {/* Empty State */}
      {displayedSites.length === 0 && (
        <div className="text-center py-16 sm:py-20">
          <div className="max-w-md mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No sites found in this category.
            </p>
            <button
              onClick={() => setSelectedTag("All")}
              className="mt-6 px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
            >
              View All Sites
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
