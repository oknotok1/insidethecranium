import Link from "next/link";
import PlaylistCard from "@/components/PlaylistCard";
import { ArrowRight } from "lucide-react";
import { UserPlaylists } from "@/types/spotify";

export default function Playlists({ playlists }: { playlists: UserPlaylists }) {
  // Mobile: 8 playlists (4 rows × 2 columns)
  // Desktop: 15 playlists (3 rows × 5 columns)
  const mobileLimit = 8;
  const desktopLimit = 15;

  // Safety check for playlists data
  if (!playlists || !playlists.items || playlists.items.length === 0) {
    return null;
  }

  const featuredPlaylists = playlists.items.slice(0, desktopLimit);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <h2 className="mb-2 text-2xl sm:text-3xl md:text-4xl">
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
            className="flex items-center space-x-2 text-sm text-gray-600 text-nowrap hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors w-fit"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Single responsive grid - mobile shows 8, desktop shows 15 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 items-start">
          {featuredPlaylists.map((playlist, index) => (
            <div
              key={playlist.id}
              className={`h-full ${index >= mobileLimit ? "hidden sm:block" : ""}`}
            >
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
