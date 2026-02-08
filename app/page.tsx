import * as contentful from "contentful";
import HeroSection from "@/components/(Homepage)/Hero";
import CuratedSongs from "@/components/(Homepage)/CuratedSongs";
import Playlists from "@/components/(Homepage)/Playlists";
import HomepageSectionSkeleton from "@/components/(Homepage)/Skeleton";

// Cache page for 24 hours (static content that rarely changes)
export const revalidate = 86400;

async function getData() {
  // Get enriched playlists with genres and clean descriptions from our API
  let playlists = {
    items: [],
    total: 0,
    offset: 0,
    limit: 0,
    next: null,
    href: "",
    previous: null
  };

  try {
    const playlistsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/playlists?limit=50`,
      {
        next: { 
          revalidate: 86400, // Cache for 24 hours
          tags: ['playlists'] // Tag for on-demand invalidation
        }
      }
    );

    if (playlistsResponse.ok) {
      const data = await playlistsResponse.json();

      if (!data.error && data.items) {
        playlists = data;
        console.log(`[Homepage] ✓ Loaded ${data.items.length} playlists from cache`);
      } else {
        console.error("[Homepage] Playlists API error:", data.error);
      }
    } else {
      console.error("[Homepage] Failed to fetch playlists:", playlistsResponse.status, playlistsResponse.statusText);
    }
  } catch (error: any) {
    console.error("[Homepage] Error fetching playlists:", error.message);
  }

  // Get Featured Songs from Contentful
  let featuredSongs = [];
  let curatedTracks = [];
  try {
    const client = contentful.createClient({
      space: process.env.CONTENTFUL_SPACE_ID || "",
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
    });

    const entry = await client.getEntry("6CiY2zbMl3CvJpY0FD2Wu1");
    featuredSongs = (entry.fields as any).featuredSongs || [];

    // Fetch tracks from Spotify (server-side with caching)
    if (featuredSongs.length > 0) {
      const songIds = featuredSongs.map((song: any) => {
        const urlParts = song.url.split("/");
        const trackPart = urlParts[urlParts.length - 1];
        return trackPart.split("?")[0];
      }).filter((id: string) => id && id.length > 0);

      if (songIds.length > 0) {
        try {
          const tracksResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/tracks?ids=${songIds.join(",")}`,
            {
              next: { 
                revalidate: false, // Cache forever (curated tracks are static)
                tags: ['curated-tracks']
              }
            }
          );

          if (tracksResponse.ok) {
            const tracksData = await tracksResponse.json();
            curatedTracks = tracksData.tracks || [];
            console.log(`[Homepage] ✓ Loaded ${curatedTracks.length} curated tracks from cache`);
          }
        } catch (error) {
          console.error("[Homepage] Error fetching curated tracks:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching featured songs:", error);
  }

  return {
    playlists,
    curatedTracks,
  };
}

export default async function Home() {
  const { playlists, curatedTracks } = await getData();

  return (
    <main>
      <HeroSection />
      {/* <HomepageSectionSkeleton /> */}
      <CuratedSongs tracks={curatedTracks} />
      <Playlists playlists={playlists} />
    </main>
  );
}
