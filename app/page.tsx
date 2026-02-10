import { cache } from "react";

import { ComingSoonPreview } from "@/components/common/ComingSoon";
import CuratedSongs from "@/components/Homepage/CuratedSongs";
import HeroSection from "@/components/Homepage/Hero";
import Playlists from "@/components/Homepage/Playlists";
import Sites from "@/components/Homepage/Sites";

import { fetchCuratedTracks } from "@/utils/contentful";
import { fetchPlaylists } from "@/utils/spotify";

export const revalidate = 86400; // 24 hours

const getData = cache(async () => {
  // Fetch playlists and curated tracks in parallel
  const [playlists, curatedTracks] = await Promise.all([
    fetchPlaylists(50, 0, false),
    fetchCuratedTracks(),
  ]);

  return {
    playlists,
    curatedTracks,
  };
});

export default async function Home() {
  const { playlists, curatedTracks } = await getData();

  return (
    <main className="flex flex-col" data-page="homepage">
      <HeroSection />
      <CuratedSongs tracks={curatedTracks} />
      <Playlists playlists={playlists} />
      <Sites />
      <ComingSoonPreview
        title="Concert Memories"
        subtitle="Relive my live music experiences and concert memories"
        href="/concerts"
      />
    </main>
  );
}
