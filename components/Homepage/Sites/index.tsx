"use client";

import { ArrowRight } from "lucide-react";
import { getFeaturedSites, getNonFeaturedSites } from "@/data/sites";

import Link from "next/link";

import SiteCard from "@/components/Sites/SiteCard";

import styles from "./styles.module.scss";

const DESKTOP_LIMIT = 8;

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

// View All link component
const ViewAllLink = () => (
  <Link
    href="/sites"
    onClick={scrollToTop}
    className={`${styles.viewAllLink} text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`}
  >
    <span>View All</span>
    <ArrowRight className="h-4 w-4" />
  </Link>
);

// View More Card for mobile carousel
const ViewMoreCard = ({ totalCount }: { totalCount: number }) => (
  <Link href="/sites" onClick={scrollToTop} className={styles.viewMoreCard}>
    <div
      className={`${styles.viewMoreCardInner} border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:hover:border-gray-600 dark:hover:bg-white/10`}
    >
      <h3 className="mb-2 text-center text-base font-medium text-gray-900 sm:text-lg dark:text-white">
        More Sites
      </h3>
      <p className="mb-4 text-center text-xs text-gray-600 sm:text-sm dark:text-gray-400">
        Discover all {totalCount} recommended sites
      </p>
      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <span>View All</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  </Link>
);

export default function Sites() {
  const featuredSites = getFeaturedSites();
  const nonFeaturedSites = getNonFeaturedSites();
  const allSitesInOrder = [...featuredSites, ...nonFeaturedSites];

  if (!allSitesInOrder?.length) return null;

  const displayedSites = allSitesInOrder.slice(0, DESKTOP_LIMIT);
  const totalCount = featuredSites.length + nonFeaturedSites.length;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Recommended Sites</h2>
            <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
              My favorite platforms for discovering and exploring music. From
              streaming services to analytics tools, these sites have shaped my
              musical journey.
            </p>
          </div>
          <ViewAllLink />
        </div>

        {/* Mobile: Horizontal scroll carousel */}
        <div className={styles.mobileCarouselWrapper}>
          <div className={styles.mobileCarousel}>
            {displayedSites.map((site, index) => (
              <div
                key={site.id}
                className={`${styles.siteCard} ${index === 0 ? styles.siteCardFirst : ""}`}
              >
                <div className={styles.siteCardInner}>
                  <SiteCard site={site} />
                </div>
              </div>
            ))}
            <ViewMoreCard totalCount={totalCount} />
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className={styles.desktopGrid}>
          {displayedSites.map((site) => (
            <div key={site.id} className={styles.siteCardWrapper}>
              <SiteCard site={site} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
