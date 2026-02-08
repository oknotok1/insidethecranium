import * as contentful from "contentful";
import HeroSection from "@/components/(Homepage)/Hero";
import CuratedSongs from "@/components/(Homepage)/CuratedSongs";
import Playlists from "@/components/(Homepage)/Playlists";
import HomepageSectionSkeleton from "@/components/(Homepage)/Skeleton";

// Enable caching for this page
export const revalidate = 300; // Revalidate every 5 minutes

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
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/playlists?limit=15`,
      {
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    );

    if (playlistsResponse.ok) {
      const data = await playlistsResponse.json();

      if (!data.error && data.items) {
        playlists = data;
      } else {
        console.error("Playlists API error:", data.error);
      }
    } else {
      console.error("Failed to fetch playlists:", playlistsResponse.status, playlistsResponse.statusText);
    }
  } catch (error: any) {
    console.error("Error fetching playlists:", error.message);
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
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/spotify/tracks?ids=${songIds.join(",")}`,
            {
              next: { revalidate: 300 } // Cache for 5 minutes
            }
          );

          if (tracksResponse.ok) {
            const tracksData = await tracksResponse.json();
            curatedTracks = tracksData.tracks || [];
          }
        } catch (error) {
          console.error("Error fetching curated tracks:", error);
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
