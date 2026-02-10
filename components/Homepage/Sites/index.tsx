"use client";

import Link from "next/link";
import SiteCard from "@/components/Sites/SiteCard";
import { ArrowRight } from "lucide-react";
import { getFeaturedSites, getNonFeaturedSites } from "@/data/sites";

export default function Sites() {
  const featuredSites = getFeaturedSites();
  const nonFeaturedSites = getNonFeaturedSites();

  // Desktop: 8 sites (2 rows × 4 columns)
  const desktopLimit = 8;

  // Combine featured and non-featured sites to ensure we have enough
  const allSitesInOrder = [...featuredSites, ...nonFeaturedSites];

  // Safety check for sites data
  if (!allSitesInOrder || allSitesInOrder.length === 0) {
    return null;
  }

  const displayedSites = allSitesInOrder.slice(0, desktopLimit);
  const totalSitesCount = featuredSites.length + nonFeaturedSites.length;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl">
              Recommended Sites
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              My favorite platforms for discovering and exploring music. From
              streaming services to analytics tools, these sites have shaped my
              musical journey.
            </p>
          </div>

          <Link
            href="/sites"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 text-nowrap hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors w-fit"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="block lg:hidden overflow-hidden -mx-4 sm:-mx-6">
          <div className="flex overflow-x-scroll scrollbar-hide gap-4 items-stretch">
            {displayedSites.map((site, index) => (
              <div
                key={site.id}
                className={`shrink-0 w-[45%] min-w-[160px] max-w-[200px] md:w-[30%] md:max-w-[240px] ${
                  index === 0 ? 'ml-4 sm:ml-6' : ''
                }`}
              >
                <div className="h-full">
                  <SiteCard site={site} />
                </div>
              </div>
            ))}
            {/* View More Card */}
            <Link
              href="/sites"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="shrink-0 w-[45%] min-w-[160px] max-w-[200px] md:w-[30%] md:max-w-[240px] mr-4 sm:mr-6"
            >
              <div className="h-full flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
                  More Sites
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  Discover all {totalSitesCount} recommended sites
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {displayedSites.map((site) => (
            <div key={site.id} className="flex">
              <SiteCard site={site} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
