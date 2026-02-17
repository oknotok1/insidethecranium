import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { fetchAllConcerts } from "@/utils/contentful";
import { AdminPageHeader } from "@/components/Admin/AdminPageHeader";
import { AdminStatusBanner } from "@/components/Admin/AdminStatusBanner";
import { AdminConcertItem } from "@/components/Admin/AdminConcertItem";
import { AdminAPIEndpoints } from "@/components/Admin/AdminAPIEndpoints";
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

  const apiEndpoints = [
    { url: "/api/concerts", label: "List all concerts (JSON)" },
    ...(concerts.length > 0 
      ? [{ url: `/api/concerts/${concerts[0].slug}`, label: "Single concert (JSON)" }] 
      : []),
  ];

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <AdminPageHeader
          backLink="/admin"
          backLabel="Back to Admin"
          title="Manage Concerts"
          subtitle="View, edit, and publish concert entries from Contentful"
          actionButton={
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
          }
        />

        <TokenExpiryReminder />

        <AdminStatusBanner
          items={[
            { 
              label: "Backend Status", 
              value: concerts.length > 0 ? "✅ Connected to Contentful" : "⚠️ No concerts found" 
            },
            { 
              label: "Total Concerts", 
              value: `${concerts.length} (${publishedCount} published, ${unpublishedCount} unpublished)` 
            },
            { label: "User", value: session?.user?.email || "Unknown" },
          ]}
        />

        {concerts.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              All Concerts ({concerts.length})
            </h2>
            <div className="space-y-4">
              {concerts.map((concert) => (
                <AdminConcertItem
                  key={concert.id}
                  concert={concert}
                  contentfulSpaceId={contentfulSpaceId}
                />
              ))}
            </div>
          </div>
        )}

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
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
              Create your first concert in Contentful to get started
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

        <AdminAPIEndpoints endpoints={apiEndpoints} />
      </div>
    </main>
  );
}
