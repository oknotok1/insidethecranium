import { fetchConcertBySlug } from "@/utils/contentful";
import { enrichConcertWithArtistUrl } from "@/utils/spotify-enrichment";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ConcertDetailsStrip } from "@/components/Concerts/ConcertDetailsStrip";
import { ConcertMediaGrid } from "@/components/Concerts/ConcertMediaGrid";

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
    title: `${concert.title} - Concerts`,
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
    <div className="mx-auto min-h-screen max-w-7xl pb-12 pt-20 sm:pb-20 sm:pt-24">
      {/* Header */}
      <div className="mb-8 px-4 sm:mb-12 sm:px-6 lg:px-8">
        <Link
          href="/concerts"
          className="mb-6 inline-flex items-center space-x-2 text-sm text-gray-600 transition-colors hover:text-gray-900 sm:mb-8 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Concerts</span>
        </Link>

        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-3xl leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
            {enrichedConcert.title}
          </h1>

          {enrichedConcert.subtitle && (
            <p className="text-lg text-gray-600 sm:text-xl dark:text-gray-400">{enrichedConcert.subtitle}</p>
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

          {/* Reflection */}
          {concert.reflection && (
            <div className="max-w-4xl rounded-lg bg-gray-100 p-4 sm:p-6 dark:bg-white/5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 sm:text-base dark:text-gray-300">
                {concert.reflection}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Media Gallery */}
      {(concert.galleryImages.length > 0 || concert.videos.length > 0) && (
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-xl text-gray-900 sm:mb-6 sm:text-2xl dark:text-white">Photos & Videos</h2>
          <ConcertMediaGrid
            concertSlug={concert.slug}
            concertTitle={concert.title}
            galleryImages={concert.galleryImages}
            videos={concert.videos}
          />
        </div>
      )}
    </div>
  );
}
