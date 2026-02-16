import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { fetchAllConcerts } from "@/utils/contentful";
import ConcertActions from "@/components/Admin/ConcertActions";
import TokenExpiryReminder from "@/components/Admin/TokenExpiryReminder";

export const metadata = {
  title: "Manage Concerts - Admin",
  robots: {
    index: false,
    follow: false,
  },
};

// Don't cache admin pages - always fetch fresh data
export const revalidate = 0;

export default async function AdminConcertsPage() {
  // Check authentication server-side
  const session = await auth();

  if (!session) {
    redirect("/admin");
  }

  // Fetch ALL concerts (including unpublished) server-side
  const concerts = await fetchAllConcerts();
  const publishedCount = concerts.filter((c) => c.published).length;
  const unpublishedCount = concerts.filter((c) => !c.published).length;
  const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID || "";

  return (
    <main className="flex flex-col">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/admin"
                className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Admin
              </Link>
              <h1 className="text-3xl sm:text-4xl md:text-5xl">
                Manage Concerts
              </h1>
              <p className="mt-2 text-sm text-gray-600 sm:text-base dark:text-gray-400">
                Backend test - viewing concerts from Contentful
              </p>
            </div>
            <a
              href={`https://app.contentful.com/spaces/${contentfulSpaceId}/entries?contentTypeId=concert`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3d38f5] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#2e29cc] dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add in Contentful
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>

          {/* Status */}
          {/* Token Expiry Warning */}
          <TokenExpiryReminder />

          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/30 dark:bg-blue-900/10">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Backend Status:</strong>{" "}
              {concerts.length > 0 ? "✅ Connected to Contentful" : "⚠️ No concerts found"}
              <br />
              <strong>Total Concerts:</strong> {concerts.length} ({publishedCount}{" "}
              published, {unpublishedCount} unpublished)
              <br />
              <strong>User:</strong> {session?.user?.email}
            </p>
          </div>

          {/* Concert List */}
          {concerts.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 sm:p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="mb-4 text-xl sm:text-2xl">
                All Concerts ({concerts.length})
              </h2>
              <div className="space-y-4">
                {concerts.map((concert) => {
                  const eventDate = new Date(concert.eventDate);
                  const formattedDate = eventDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={concert.id}
                      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row dark:border-white/10 dark:bg-black/20"
                    >
                      {/* Cover Image */}
                      <img
                        src={concert.coverImageUrl}
                        alt={concert.coverImageAlt}
                        className="h-32 w-full rounded-lg object-cover sm:w-48"
                      />

                      {/* Content */}
                      <div className="flex flex-1 gap-4">
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <Link
                              href={`/concerts/${concert.slug}`}
                              className="mb-1 inline-block text-lg font-bold text-gray-900 hover:text-[#3d38f5] dark:text-white dark:hover:text-[#8b87ff]"
                            >
                              {concert.title}
                            </Link>
                            {concert.subtitle && (
                              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                {concert.subtitle}
                              </p>
                            )}
                            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {concert.artistBand}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {concert.venueName}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {formattedDate}
                              </span>
                            </div>
                            {concert.genres && concert.genres.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {concert.genres.slice(0, 4).map((genre) => (
                                  <span
                                    key={genre}
                                    className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-white/10 dark:text-gray-300"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <ConcertActions
                          concertId={concert.id}
                          concertTitle={concert.title}
                          published={concert.published}
                          contentfulSpaceId={contentfulSpaceId}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {concerts.length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
              <svg
                className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                No concerts yet
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Create your first concert in Contentful with Published = true
              </p>
              <a
                href={`https://app.contentful.com/spaces/${contentfulSpaceId}/entries?contentTypeId=concert`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#3d38f5] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#2e29cc] dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Your First Concert
              </a>
            </div>
          )}

          {/* API Test Links */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Test API Endpoints:
            </p>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a
                  href="/api/concerts"
                  target="_blank"
                  className="text-[#3d38f5] hover:underline dark:text-[#8b87ff]"
                >
                  /api/concerts
                </a>{" "}
                - List all concerts (JSON)
              </li>
              {concerts.length > 0 && (
                <li>
                  <a
                    href={`/api/concerts/${concerts[0].slug}`}
                    target="_blank"
                    className="text-[#3d38f5] hover:underline dark:text-[#8b87ff]"
                  >
                    /api/concerts/{concerts[0].slug}
                  </a>{" "}
                  - Single concert (JSON)
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
