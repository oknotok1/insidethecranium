"use client";

import Link from "next/link";
import PlaylistCard from "@/components/Playlists/PlaylistCard";
import { ArrowRight } from "lucide-react";
import { UserPlaylists } from "@/types/spotify";

export default function Playlists({ playlists }: { playlists: UserPlaylists }) {
  // Desktop: 15 playlists (3 rows × 5 columns)
  const desktopLimit = 15;

  // Safety check for playlists data
  if (!playlists || !playlists.items || playlists.items.length === 0) {
    return null;
  }

  const featuredPlaylists = playlists.items.slice(0, desktopLimit);

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl">
              My Playlists
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              I have curated{" "}
              <strong>{playlists.total || playlists.items.length}</strong>{" "}
              playlists thus far. They're mostly grouped by genres, and or
              moods. I know it's excessive, but I can't help it. I'll be
              creating a directory soon to help you navigate through them.
            </p>
          </div>

          <Link
            href="/playlists"
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
            {featuredPlaylists.map((playlist, index) => (
              <div
                key={playlist.id}
                className={`shrink-0 w-[45%] min-w-[160px] max-w-[200px] md:w-[30%] md:max-w-[240px] ${
                  index === 0 ? 'ml-4 sm:ml-6' : ''
                }`}
              >
                <div className="h-full">
                  <PlaylistCard playlist={playlist} />
                </div>
              </div>
            ))}
            {/* View More Card */}
            <Link
              href="/playlists"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="shrink-0 w-[45%] min-w-[160px] max-w-[200px] md:w-[30%] md:max-w-[240px] mr-4 sm:mr-6"
            >
              <div className="h-full flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2 text-center">
                  More Playlists
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  Explore all {playlists.total || playlists.items.length} playlists
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
        <div className="hidden lg:grid grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 items-start">
          {featuredPlaylists.map((playlist) => (
            <div key={playlist.id} className="h-full">
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
