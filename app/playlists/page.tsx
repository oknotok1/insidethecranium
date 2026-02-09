import { cache } from "react";
import PlaylistsGrid from "@/components/Playlists/PlaylistsGrid";
import { UserPlaylists } from "@/types/spotify";
import { logger } from "@/utils/logger";

export const metadata = {
  title: "All Playlists - Inside The Cranium",
  description: "Browse all of Jeff's curated Spotify playlists",
};

// Cache page for 24 hours (static content)
export const revalidate = 86400;

const getInitialPlaylists = cache(async (): Promise<UserPlaylists> => {
  try {
    // Fetch first batch with genres (10 playlists)
    const playlistsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/playlists?limit=10&offset=0&includeGenres=true`,
      {
        next: {
          revalidate: 86400, // Cache for 24 hours
          tags: ["playlists"],
        },
      },
    );

    if (playlistsResponse.ok) {
      const data = await playlistsResponse.json();

      if (!data.error && data.items) {
        logger.success(
          "Playlists Page",
          `Loaded initial ${data.items.length} playlists`,
        );
        return data;
      }
    }
  } catch (error: any) {
    logger.error(
      "Playlists Page",
      `Error fetching playlists: ${error.message}`,
    );
  }

  return {
    items: [],
    total: 0,
    offset: 0,
    limit: 0,
    next: null,
    href: "",
    previous: null,
  } as UserPlaylists;
});

export default async function PlaylistsPage() {
  const initialData = await getInitialPlaylists();

  return (
    <main className="flex flex-col">
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 sm:mb-12">
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl">
              All Playlists
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              I have curated{" "}
              <strong>{initialData.total}</strong>{" "}
              playlists thus far. They're mostly grouped by genres, and or
              moods. I know it's excessive, but I can't help it. I'll be
              creating a directory soon to help you navigate through them.
            </p>
          </div>

          {initialData.items.length > 0 ? (
            <PlaylistsGrid
              initialPlaylists={initialData.items}
              totalCount={initialData.total}
            />
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-12">
              No playlists available at the moment.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
