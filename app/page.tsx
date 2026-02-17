import { cache } from "react";

import Concerts from "@/components/Homepage/Concerts";
import CuratedSongs from "@/components/Homepage/CuratedSongs";
import HeroSection from "@/components/Homepage/Hero";
import Playlists from "@/components/Homepage/Playlists";
import Sites from "@/components/Homepage/Sites";

import { fetchConcertsDetailed, fetchCuratedTracks } from "@/utils/contentful";
import { enrichConcertsWithArtistImages } from "@/utils/spotify-enrichment";
import { fetchPlaylists } from "@/utils/spotify";

export const revalidate = 86400; // 24 hours

const getData = cache(async () => {
  // Fetch playlists, curated tracks, and concerts in parallel
  const [playlists, curatedTracks, concertsDetailed] = await Promise.all([
    fetchPlaylists(50, 0, true), // Include genres for homepage playlists
    fetchCuratedTracks(),
    fetchConcertsDetailed(), // Fetch detailed for media filtering
  ]);

  const now = new Date();

  // Filter concerts: past date + (has gallery images OR videos)
  const pastConcerts = concertsDetailed
    .filter((concert) => new Date(concert.eventDate) < now)
    .filter((concert) => {
      const hasGalleryImages =
        concert.galleryImages && concert.galleryImages.length > 0;
      const hasVideos = concert.videos && concert.videos.length > 0;
      return hasGalleryImages || hasVideos;
    })
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .map((concert) => ({
      ...concert,
      firstGalleryImage: concert.galleryImages?.[0]?.url || null,
    }));

  // Enrich concerts with artist images for fallback
  const concerts = await enrichConcertsWithArtistImages(pastConcerts);

  return {
    playlists,
    curatedTracks,
    concerts,
  };
});

export default async function Home() {
  const { playlists, curatedTracks, concerts } = await getData();

  return (
    <main className="flex flex-col" data-page="homepage">
      <HeroSection />
      <CuratedSongs tracks={curatedTracks} />
      <Playlists playlists={playlists} />
      <Concerts concerts={concerts} />
      <Sites />
    </main>
  );
}
