import { cache } from "react";

import PlaylistsGrid from "@/components/Playlists/PlaylistsGrid";

import { fetchPlaylists } from "@/utils/spotify";

export const metadata = {
  title: "All Playlists - Inside The Cranium",
  description: "Browse all of Jeff's curated Spotify playlists",
};

// Constants
const INITIAL_LIMIT = 10;
const INITIAL_OFFSET = 0;
const INCLUDE_GENRES = true;

// Cache page for 24 hours (static content)
export const revalidate = 86400;

const getInitialPlaylists = cache(async () => {
  return await fetchPlaylists(INITIAL_LIMIT, INITIAL_OFFSET, INCLUDE_GENRES);
});

export default async function PlaylistsPage() {
  const initialData = await getInitialPlaylists();

  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-8 sm:mb-12">
          <h1 className="mb-4 text-3xl sm:mb-6 sm:text-4xl md:text-5xl">
            All Playlists
          </h1>
          <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
            I have curated <strong>{initialData.total}</strong> playlists thus
            far. They're mostly grouped by genres, and or moods. I know it's
            excessive, but I can't help it. I'll be creating a directory soon to
            help you navigate through them.
          </p>
        </div>

        {initialData.items.length > 0 ? (
          <PlaylistsGrid
            initialPlaylists={initialData.items}
            totalCount={initialData.total}
          />
        ) : (
          <p className="py-12 text-center text-gray-600 dark:text-gray-400">
            No playlists available at the moment.
          </p>
        )}
      </div>
    </main>
  );
}
