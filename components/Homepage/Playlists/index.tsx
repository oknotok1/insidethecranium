"use client";

import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { UserPlaylists } from "@/types/spotify";

import PlaylistCard from "@/components/Playlists/PlaylistCard";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl">
              My Playlists
            </h2>
            <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
              I have curated{" "}
              <strong>{playlists.total || playlists.items.length}</strong>{" "}
              playlists thus far. They're mostly grouped by genres, and or
              moods. I know it's excessive, but I can't help it. I'll be
              creating a directory soon to help you navigate through them.
            </p>
          </div>

          <Link
            href="/playlists"
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
            {featuredPlaylists.map((playlist, index) => (
              <div
                key={playlist.id}
                className={`w-[45%] max-w-[200px] min-w-[160px] shrink-0 md:w-[30%] md:max-w-[240px] ${
                  index === 0 ? "ml-4 sm:ml-6" : ""
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
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mr-4 w-[45%] max-w-[200px] min-w-[160px] shrink-0 sm:mr-6 md:w-[30%] md:max-w-[240px]"
            >
              <div className="flex h-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-gray-400 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/5 dark:hover:border-gray-600 dark:hover:bg-white/10">
                <h3 className="mb-2 text-center text-base font-medium text-gray-900 sm:text-lg dark:text-white">
                  More Playlists
                </h3>
                <p className="mb-4 text-center text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                  Explore all {playlists.total || playlists.items.length}{" "}
                  playlists
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
        <div className="hidden grid-cols-4 items-start gap-3 sm:gap-4 md:gap-6 lg:grid xl:grid-cols-5">
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
