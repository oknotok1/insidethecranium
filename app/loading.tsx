import CuratedSongsSkeleton from "@/components/Homepage/CuratedSongs/Skeleton";
import { HeroSkeleton } from "@/components/Homepage/Hero/HeroSkeleton";
import PlaylistsSkeleton from "@/components/Homepage/Playlists/Skeleton";
import ConcertsSkeleton from "@/components/Homepage/Concerts/Skeleton";
import SitesSkeleton from "@/components/Homepage/Sites/Skeleton";

export default function Loading() {
  return (
    <main className="flex flex-col" data-page="homepage">
      <HeroSkeleton />
      <CuratedSongsSkeleton />
      <PlaylistsSkeleton />
      <ConcertsSkeleton />
      <SitesSkeleton />
    </main>
  );
}
