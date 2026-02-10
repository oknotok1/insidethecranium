import { ArrowLeft } from "lucide-react";

import Link from "next/link";

export default function ErrorState() {
  return (
    <main className="flex flex-col">
      <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl text-gray-900 dark:text-white">
            Error Loading Playlist
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            There was a problem loading this playlist. Please try again later.
          </p>
          <Link
            href="/playlists"
            className="inline-flex items-center space-x-2 text-[#3d38f5] transition-colors hover:text-[#2d28e5]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Playlists</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
