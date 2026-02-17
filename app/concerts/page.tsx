import { fetchConcerts, fetchConcertsDetailed } from "@/utils/contentful";
import {
  enrichConcertsWithArtistImages,
  enrichConcertsWithArtistUrls,
} from "@/utils/spotify-enrichment";
import { ConcertsPageHeader } from "@/components/Concerts/ConcertsPageHeader";
import { UpcomingShowsSection } from "@/components/Concerts/UpcomingShowsSection";
import { ConcertArchiveSection } from "@/components/Concerts/ConcertArchiveSection";
import { ConcertsEmptyState } from "@/components/Concerts/ConcertsEmptyState";

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
    <main className="min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <ConcertsPageHeader 
          pastCount={pastConcerts.length} 
          upcomingCount={upcomingConcerts.length} 
        />

        <UpcomingShowsSection 
          confirmedShows={confirmedShows} 
          onFenceShows={onFenceShows} 
        />

        <ConcertArchiveSection 
          pastConcertsList={pastConcertsList} 
          pastConcerts={pastConcerts} 
        />

        {allConcerts.length === 0 && <ConcertsEmptyState />}
      </div>
    </main>
  );
}
