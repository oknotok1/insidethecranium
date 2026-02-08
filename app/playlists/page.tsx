import { cache } from 'react';
import PlaylistCard from "@/components/PlaylistCard";
import { UserPlaylists } from "@/types/spotify";
import { logger } from "@/utils/logger";

export const metadata = {
  title: "All Playlists - Inside The Cranium",
  description: "Browse all of Jeff's curated Spotify playlists",
};

// Cache page for 24 hours (static content)
export const revalidate = 86400;

const getAllPlaylists = cache(async (): Promise<UserPlaylists> => {
  try {
    const playlistsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/playlists?limit=50`,
      {
        next: {
          revalidate: 86400, // Cache for 24 hours
          tags: ['playlists']
        }
      }
    );

    if (playlistsResponse.ok) {
      const data = await playlistsResponse.json();

      if (!data.error && data.items) {
        logger.success('Playlists Page', `Loaded ${data.items.length} playlists from cache`);
        return data;
      }
    }
  } catch (error: any) {
    logger.error('Playlists Page', `Error fetching playlists: ${error.message}`);
  }

  return {
    items: [],
    total: 0,
    offset: 0,
    limit: 0,
    next: null,
    href: "",
    previous: null
  } as UserPlaylists;
});

export default async function PlaylistsPage() {
  const playlists = await getAllPlaylists();

  return (
    <section className="pt-20 sm:pt-24 pb-8 sm:pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-12">
          <h1 className="mb-2 text-3xl sm:text-4xl md:text-5xl">All Playlists</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            I have curated <strong>{playlists.total || playlists.items.length}</strong> playlists thus far. They're mostly grouped by genres, and or moods. I know it's excessive, but I can't help it. I'll be creating a directory soon to help you navigate through them.
          </p>
        </div>

        {playlists.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {playlists.items.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-center py-12">
            No playlists available at the moment.
          </p>
        )}
      </div>
    </section>
  );
}
