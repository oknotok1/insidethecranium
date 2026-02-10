"use client";

import Link from "next/link";

import { getFeaturedSites, getNonFeaturedSites } from "@/data/sites";
import { ArrowRight } from "lucide-react";

import SiteCard from "@/components/Sites/SiteCard";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl">
              Recommended Sites
            </h2>
            <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
              My favorite platforms for discovering and exploring music. From
              streaming services to analytics tools, these sites have shaped my
              musical journey.
            </p>
          </div>

          <Link
            href="/sites"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="hidden w-fit items-center space-x-2 text-sm text-nowrap text-gray-600 transition-colors hover:text-gray-900 lg:flex dark:text-gray-400 dark:hover:text-white"
          >
            <span>View All</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className="-mx-4 block overflow-hidden sm:-mx-6 lg:hidden">
          <div className="scrollbar-hide flex items-stretch gap-4 overflow-x-scroll">
            {displayedSites.map((site, index) => (
              <div
                key={site.id}
                className={`w-[45%] max-w-[200px] min-w-[160px] shrink-0 md:w-[30%] md:max-w-[240px] ${
                  index === 0 ? "ml-4 sm:ml-6" : ""
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
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mr-4 w-[45%] max-w-[200px] min-w-[160px] shrink-0 sm:mr-6 md:w-[30%] md:max-w-[240px]"
            >
              <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:hover:border-gray-600 dark:hover:bg-white/10">
                <h3 className="mb-2 text-center text-base font-medium text-gray-900 sm:text-lg dark:text-white">
                  More Sites
                </h3>
                <p className="mb-4 text-center text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                  Discover all {totalSitesCount} recommended sites
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:grid xl:grid-cols-4">
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
