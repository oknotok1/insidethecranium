import Link from "next/link";
import SiteCard from "@/components/Sites/SiteCard";
import { ArrowRight } from "lucide-react";
import { getFeaturedSites } from "@/data/sites";

export default function Sites() {
  const featuredSites = getFeaturedSites();

  // Mobile: 4 sites (2 rows × 2 columns)
  // Desktop: 8 sites (2 rows × 4 columns)
  const mobileLimit = 4;
  const desktopLimit = 8;

  // Safety check for sites data
  if (!featuredSites || featuredSites.length === 0) {
    return null;
  }

  const displayedSites = featuredSites.slice(0, desktopLimit);

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
            className="flex items-center space-x-2 text-sm text-gray-600 text-nowrap hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors w-fit"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Single responsive grid - mobile shows 4 (2x2), desktop shows 8 (2x4) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayedSites.map((site, index) => (
            <div
              key={site.id}
              className={`h-full ${index >= mobileLimit ? "hidden lg:block" : ""}`}
            >
              <SiteCard site={site} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
