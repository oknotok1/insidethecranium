import { ArrowLeft } from "lucide-react";

import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { ConcertDetailsStrip } from "@/components/Concerts/ConcertDetailsStrip";
import { ConcertMediaGrid } from "@/components/Concerts/ConcertMediaGrid";

import { fetchConcertBySlug } from "@/utils/contentful";
import { enrichConcertWithArtistUrl } from "@/utils/spotify-enrichment";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Revalidate every 24 hours or when webhook triggers
export const revalidate = 86400;

// Generate static params for published concerts at build time
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const concert = await fetchConcertBySlug(slug);

  if (!concert) {
    return {
      title: "Concert Not Found",
    };
  }

  return {
    title: concert.title,
    description: concert.reflection
      ? concert.reflection.substring(0, 160)
      : `${concert.artistBand} at ${concert.venueName} on ${new Date(concert.eventDate).toLocaleDateString()}`,
  };
}

export default async function ConcertDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const concert = await fetchConcertBySlug(slug);

  if (!concert) {
    notFound();
  }

  // Enrich concert with Spotify artist URL
  const enrichedConcert = await enrichConcertWithArtistUrl(concert);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Back Link */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <Link
          href="/concerts"
          className="inline-flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Concerts</span>
        </Link>
      </div>

      {/* Header Section */}
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
              {enrichedConcert.title}
            </h1>

            {enrichedConcert.subtitle && (
              <p className="text-lg text-gray-600 sm:text-xl dark:text-gray-400">
                {enrichedConcert.subtitle}
              </p>
            )}

            <ConcertDetailsStrip
              artistBand={enrichedConcert.artistBand}
              artistSpotifyUrl={enrichedConcert.artistSpotifyUrl}
              eventDate={enrichedConcert.eventDate}
              venueName={enrichedConcert.venueName}
              venueLocation={enrichedConcert.venueLocation}
              venueLink={enrichedConcert.venueLink}
              setlistFmLink={enrichedConcert.setlistFmLink}
              ticketLink={enrichedConcert.ticketLink}
              genres={enrichedConcert.genres}
            />
          </div>
        </div>
      </section>

      {/* Reflection Section */}
      {concert.reflection && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-sm font-light leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-4">{children}</p>,
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3d38f5] transition-all hover:underline dark:text-[#8b87ff]"
                  >
                    {children}
                  </a>
                ),
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
              }}
            >
              {concert.reflection}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Media Gallery Section */}
      {(concert.galleryImages.length > 0 || concert.videos.length > 0) && (
        <section className="py-6 sm:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-xl text-gray-900 sm:mb-6 sm:text-2xl dark:text-white">
              Photos & Videos
            </h2>
            <ConcertMediaGrid
              concertSlug={concert.slug}
              concertTitle={concert.title}
              galleryImages={concert.galleryImages}
              videos={concert.videos}
            />
          </div>
        </section>
      )}
    </main>
  );
}
