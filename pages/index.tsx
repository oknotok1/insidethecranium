import Head from "next/head";
import styles from "@/styles/Home.module.scss";
import useSWR from "swr";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { UserPlaylists, UserProfile } from "@/types/spotify";
import NowPlaying from "@/components/NowPlaying";
import FeaturedSongs from "@/components/FeaturedSongs";
import Playlists from "@/components/Playlists";
import Footer from "@/components/Footer";
import { FeaturedSong } from "@/types/contentful";

export default function Home({
  accessToken: initialAccessToken,
  profile,
  playlists,
  featuredSongs,
}: {
  accessToken: string;
  profile: UserProfile;
  playlists: UserPlaylists;
  featuredSongs?: FeaturedSong[];
}) {
  const [accessToken, setAccessToken] = useState<string | undefined>(
    initialAccessToken
  );

  const fetcher = (url: string) => axios.post(url).then((res) => res.data);

  const { data: fetchedAccessToken } = useSWR<string>(
    "/api/Spotify/getAccessToken",
    fetcher,
    {
      refreshInterval: 3600,
    }
  );

  const getProfile = async () => {
    axios
      .get("/api/Spotify/getProfile", {
        headers: {
          access_token: accessToken,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      .then((res) => res.data)
      .catch((err) => console.error(err));
  };

  const getUserPlaylists = async () => {
    axios
      .get("/api/Spotify/getUserPlaylists", {
        headers: {
          access_token: accessToken,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      .then((res) => res.data)
      .catch((err) => console.error(err));
  };

  const getCurrentlyPlayingTrack = async () => {
    axios
      .get("/api/Spotify/getCurrentlyPlayingTrack", {
        headers: {
          access_token: accessToken,
        },
      })
      .then((res) => res.data)
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchedAccessToken && setAccessToken(fetchedAccessToken);
  }, [fetchedAccessToken]);

  return (
    <>
      <Head>
        <title>Inside The Cranium</title>
        <meta name="description" content="A directory to Jeff's Spotify" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.home}>
        <NowPlaying accessToken={accessToken} />
        <FeaturedSongs featuredSongs={featuredSongs} />
        <Playlists playlists={playlists} />
      </main>
      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // get the access token
  const { data: accessToken } = await axios.post(
    `${baseUrl}/api/Spotify/getAccessToken`
  );

  // get the user profile
  const { data: profile } = await axios.get(
    `${baseUrl}/api/Spotify/getProfile`,
    {
      headers: {
        access_token: accessToken,
      },
    }
  );

  // get the user playlists
  const { data: playlists } = await axios.get(
    `${baseUrl}/api/Spotify/getUserPlaylists`,
    {
      headers: {
        access_token: accessToken,
      },
    }
  );

  // get Featured Songs from Contentful
  const { data: featuredSongs } = await axios.get(
    `${baseUrl}/api/Contentful/getEntries?entryId=6CiY2zbMl3CvJpY0FD2Wu1`
  );

  return {
    props: {
      accessToken,
      profile,
      playlists,
      featuredSongs,
    },
  };
}
