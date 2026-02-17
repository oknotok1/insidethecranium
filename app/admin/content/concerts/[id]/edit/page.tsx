import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";

import ConcertEditForm from "@/components/Admin/ConcertEditForm";
import { fetchConcertById } from "@/utils/contentful";

export const metadata = {
  title: "Edit Concert",
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
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="mb-4 text-3xl sm:mb-6 sm:text-4xl md:text-5xl">
          Edit Concert
        </h1>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          Update concert information and media for <span className="font-medium text-gray-900 dark:text-white">{concert.title}</span>
        </p>
      </div>

      {/* Edit Form */}
      <ConcertEditForm concert={concert} />
      </div>
    </div>
  );
}
