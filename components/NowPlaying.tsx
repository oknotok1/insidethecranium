import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import styles from "@/styles/NowPlaying.module.scss";
import { useAppContext } from "@/contexts/AppContext";

const NowPlaying = ({ accessToken }: { accessToken: string | undefined }) => {
  const { setIsListening: setIsListening_context } = useAppContext();
  const prevAccessToken = useRef<string | undefined>(accessToken);

  const fetcher = (url: string) =>
    axios
      .get(url, {
        headers: {
          access_token: accessToken,
        },
      })
      .then((res) => res.data)
      .catch((err) => console.error(err));

  const { data: currentlyPlayingTrack, mutate } = useSWR(
    "/api/Spotify/getCurrentlyPlayingTrack",
    fetcher
  );

  const songId: string | undefined = currentlyPlayingTrack?.item?.id;
  const src: string = songId
    ? `https://open.spotify.com/embed/track/${songId}?utm_source=generator&theme=0`
    : "";
  const isPlaying = currentlyPlayingTrack?.is_playing;

  useEffect(() => {
    if (prevAccessToken.current !== accessToken) {
      prevAccessToken.current = accessToken;
      mutate();
    }
  }, [accessToken]);

  useEffect(() => {
    setIsListening_context(isPlaying);
  }, [isPlaying]);

  if (!isPlaying) return null;

  return (
    <section className={styles.nowPlaying} id="nowPlaying">
      <div className={styles.title}>
        <h1>I am currently listening to</h1>
        <CurrentTime />
      </div>
      <iframe
        title={currentlyPlayingTrack.title}
        style={{
          borderRadius: "0.5rem",
          maxWidth: "50rem",
          minHeight: "22rem",
        }}
        src={src}
        width="100%"
        allowFullScreen={false}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </section>
  );
};

const CurrentTime = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [hour, setHour] = useState<number>(new Date().getHours());
  const [minute, setMinute] = useState<number>(new Date().getMinutes());

  useEffect(() => {
    const interval = setInterval(() => {
      setHour(new Date().getHours());
      setMinute(new Date().getMinutes());
      const colon = document.getElementById("colon");
      if (colon) {
        colon.style.visibility =
          colon.style.visibility === "hidden" ? "visible" : "hidden";
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <small className="text-muted-light">
      {today} {hour}
      <span id="colon">:</span>
      {minute < 10 ? `0${minute}` : minute} {hour < 12 ? "AM" : "PM"}
    </small>
  );
};

export default NowPlaying;
