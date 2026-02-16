import { fetchConcerts, fetchConcertsDetailed } from "@/utils/contentful";
import {
  enrichConcertsWithArtistImages,
  enrichConcertsWithArtistUrls,
} from "@/utils/spotify-enrichment";
import { UpcomingShowCard } from "@/components/Concerts/UpcomingShowCard";
import { ConcertPreview } from "@/components/Concerts/ConcertPreview";
import Link from "next/link";
import { Music } from "lucide-react";

export const metadata = {
  title: "Concerts - Inside The Cranium",
  description: "Concert memories and upcoming shows",
};

// Revalidate every 24 hours or when webhook triggers
export const revalidate = 86400;

export default async function ConcertsPage() {
  // Fetch all concerts (list items for counting and navigation)
  const allConcerts = await fetchConcerts();
  
  const now = new Date();
  
  // Separate upcoming and past concerts
  const upcomingConcerts = allConcerts.filter(
    (concert) => new Date(concert.eventDate) >= now
  );
  const pastConcertsListRaw = allConcerts.filter(
    (concert) => new Date(concert.eventDate) < now
  );
  
  // Fetch detailed data for past concerts (with media)
  const allConcertsDetailed = await fetchConcertsDetailed();
  const pastConcertsRaw = allConcertsDetailed.filter(
    (concert) => new Date(concert.eventDate) < now
  );
  
  // Enrich concerts with Spotify artist data in parallel using utility functions
  const [upcomingShowsWithImages, pastConcertsList, pastConcerts] = await Promise.all([
    // Upcoming shows with both artist images and URLs
    enrichConcertsWithArtistImages(upcomingConcerts).then((concerts) =>
      enrichConcertsWithArtistUrls(concerts)
    ),
    // Jump to Concert cards with artist images only
    enrichConcertsWithArtistImages(pastConcertsListRaw),
    // Detailed past concerts with artist URLs only
    enrichConcertsWithArtistUrls(pastConcertsRaw),
  ]);
  
  // Separate confirmed and on-fence shows with images
  const confirmedShows = upcomingShowsWithImages.filter(
    (show) => show.status === "confirmed"
  );
  const onFenceShows = upcomingShowsWithImages.filter(
    (show) => show.status === "on-fence"
  );

  return (
    <div className="min-h-screen pb-12 pt-20 sm:pb-20 sm:pt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="mb-4 text-3xl text-gray-900 sm:mb-6 sm:text-4xl md:text-5xl dark:text-white">
            Concerts
          </h1>
          <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
            {pastConcerts.length} shows attended • {upcomingConcerts.length} upcoming
          </p>
        </div>

        {/* Upcoming Shows Section */}
        {upcomingConcerts.length > 0 && (
          <div className="mb-16 sm:mb-20">
          <div className="mb-6 sm:mb-8">
            <h2 className="mb-2 text-2xl text-gray-900 sm:text-3xl dark:text-white">
              Upcoming Shows
            </h2>
            <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
              Shows I'm going to and considering
            </p>
          </div>

            {/* Confirmed Shows */}
            {confirmedShows.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 flex items-center space-x-2 text-lg text-gray-900 sm:text-xl dark:text-white">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Confirmed ({confirmedShows.length})</span>
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {confirmedShows.map((show) => (
                    <UpcomingShowCard key={show.id} show={show} />
                  ))}
                </div>
              </div>
            )}

            {/* On the Fence Shows */}
            {onFenceShows.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 flex items-center space-x-2 text-lg text-gray-900 sm:text-xl dark:text-white">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span>Considering ({onFenceShows.length})</span>
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {onFenceShows.map((show) => (
                    <UpcomingShowCard key={show.id} show={show} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Concert Archive */}
        {pastConcerts.length > 0 && (
          <>
            <div className="mb-8 sm:mb-12">
              <h2 className="mb-2 text-2xl text-gray-900 sm:text-3xl dark:text-white">
                Concert Archive
              </h2>
              <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
                {pastConcerts.length} shows and counting
              </p>
            </div>

            {/* Concert Navigation */}
            <div className="mb-16 sm:mb-20">
              <h3 className="mb-4 text-xl text-gray-900 sm:mb-6 sm:text-2xl dark:text-white">
                Jump to Concert
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
                {pastConcertsList.map((concert) => (
                  <Link
                    key={concert.id}
                    href={`#${concert.slug}`}
                    className="group rounded-lg bg-gray-100 p-4 transition-all hover:bg-[#3d38f5]/20 dark:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-[#3d38f5]/10 to-[#8b87ff]/5">
                        {concert.coverImageUrl ? (
                          <img
                            src={concert.coverImageUrl}
                            alt={concert.coverImageAlt || concert.title}
                            className="h-full w-full object-cover"
                          />
                        ) : concert.artistImage ? (
                          <img
                            src={concert.artistImage}
                            alt={concert.artistBand}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Music className="h-6 w-6 text-[#3d38f5] dark:text-[#8b87ff]" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <h4 className="truncate text-sm font-semibold leading-tight text-gray-900 transition-colors group-hover:text-[#8b87ff] sm:text-base dark:text-white">
                          {concert.title}
                        </h4>
                        <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                          {concert.artistBand}
                        </p>
                        <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-500">
                          {new Date(concert.eventDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

            {/* Concert Details with Media */}
            <div className="space-y-16">
              {pastConcerts.map((concert) => (
                <ConcertPreview key={concert.id} concert={concert} />
              ))}
          </div>
          </>
        )}

        {/* Empty State */}
        {allConcerts.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-white/10 dark:bg-white/5">
            <Music className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              No concerts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for concert updates
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
