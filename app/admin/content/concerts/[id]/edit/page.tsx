import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";

import ConcertEditForm from "@/components/Admin/ConcertEditForm";
import { fetchConcertById } from "@/utils/contentful";

export const metadata = {
  title: "Edit Concert - Admin",
  robots: {
    index: false,
    follow: false,
  },
};

// Don't cache admin pages - always fetch fresh data
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditConcertPage({ params }: PageProps) {
  // Check authentication
  const session = await auth();
  if (!session) {
    redirect("/admin");
  }

  const { id } = await params;
  const concert = await fetchConcertById(id);

  if (!concert) {
    notFound();
  }

  return (
    <main className="flex flex-col">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/content/concerts"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
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
              Back to Concerts
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl">
              Edit Concert
            </h1>
            <p className="mt-2 text-sm text-gray-600 sm:text-base dark:text-gray-400">
              Update concert information and media
            </p>
          </div>

          {/* Edit Form */}
          <ConcertEditForm concert={concert} />
        </div>
      </section>
    </main>
  );
}
