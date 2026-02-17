import { cache } from "react";

import Concerts from "@/components/Homepage/Concerts";
import CuratedSongs from "@/components/Homepage/CuratedSongs";
import HeroSection from "@/components/Homepage/Hero";
import Playlists from "@/components/Homepage/Playlists";
import Sites from "@/components/Homepage/Sites";

import { fetchConcerts, fetchCuratedTracks } from "@/utils/contentful";
import { enrichConcertsWithArtistImages } from "@/utils/spotify-enrichment";
import { fetchPlaylists } from "@/utils/spotify";

export const revalidate = 86400; // 24 hours

const getData = cache(async () => {
  // Fetch playlists, curated tracks, and concerts in parallel
  const [playlists, curatedTracks, concertsRaw] = await Promise.all([
    fetchPlaylists(50, 0, true), // Include genres for homepage playlists
    fetchCuratedTracks(),
    fetchConcerts(), // Fetch past concerts for homepage
  ]);

  // Filter past concerts and sort by most recent
  const now = new Date();
  const pastConcerts = concertsRaw
    .filter((concert) => new Date(concert.eventDate) < now)
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

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
