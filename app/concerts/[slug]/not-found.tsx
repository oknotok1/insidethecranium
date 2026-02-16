import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ConcertNotFound() {
  return (
    <div className="min-h-screen pb-12 pt-20 sm:pb-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl">
          Concert Not Found
        </h1>
        <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
          The concert you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/concerts"
          className="inline-flex items-center gap-2 text-[#3d38f5] transition-colors hover:text-[#8b87ff] dark:text-[#8b87ff] dark:hover:text-[#7b77ef]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Concerts</span>
        </Link>
      </div>
    </div>
  );
}
