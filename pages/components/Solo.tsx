import { loadComponents } from "next/dist/server/load-components";
import React, { useState, useEffect, use } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { tracks as myTracks } from "../../public/data/tracks";

interface Track {
  id: string;
  title: string;
  src: string;
}

interface SpotifyData {
  songUrl: string;
  isPlaying: boolean;
  title: string;
}

const StyledSolo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  height: 100vh;
  width: 100vw;

  iframe {
    max-width: 70rem;
  }

  button {
    color: #242424;
    font: inherit;
    font-size: 0.75rem;
    background-color: #ffffff;
    border: 1px solid #282c34;
    border-radius: 0.5rem;
    margin-top: 1rem;
    padding: 0.5rem 1rem;
  }

  button:hover {
    cursor: pointer;
    background-color: #282c34;
    color: #ffffff;
    border: 1px solid #ffffff;
  }

  #randomise {
    position: absolute;
    top: 1rem;
    right: 1rem;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }
`;

export default function Solo() {
  const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());
  const { data } = useSWR<SpotifyData>("/api/spotify", fetcher, {
    refreshInterval: 1000,
  });
  let src = "";
  if (data && data.songUrl) {
    const songId = data.songUrl.split("/").pop();
    src = `https://open.spotify.com/embed/track/${songId}?utm_source=generator&theme=0`;
  }
  const [track, setTrack] = useState<Track>(myTracks[0]);

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

  const toggleLink = (): void => {
    window.open(
      "https://open.spotify.com/user/21h6osgmy2twlu7ichm7ygfhq?si=96fadda3e46144dc"
    );
  };

  const randomise = (): void => {
    setTrack(myTracks[Math.floor(Math.random() * myTracks.length)]);
  };

  return (
    <StyledSolo>
      {!data?.isPlaying && (
        <a href="#" id="randomise" onClick={randomise}>
          🎲
        </a>
      )}
      {data?.isPlaying ? <h1>Now Playing</h1> : <h1>Track #{track.id}</h1>}
      <p>
        {today} {hour}
        <span id="colon">:</span>
        {minute < 10 ? `0${minute}` : minute} {hour < 12 ? "AM" : "PM"}
      </p>

      {data?.isPlaying ? (
        <>
          <iframe
            title={data.title}
            style={{ borderRadius: "12px", maxWidth: "50rem" }}
            src={src}
            width="100%"
            height="352"
            frameBorder="0"
            allowFullScreen={false}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </>
      ) : (
        <iframe
          title={track.title}
          style={{ borderRadius: "12px", maxWidth: "50rem" }}
          src={track.src}
          width="100%"
          height="352"
          frameBorder="0"
          allowFullScreen={false}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      )}
      <button
        onClick={() => {
          alert("You asked for it. 🤷🏻‍♀️");
          toggleLink();
        }}
      >
        Follow Me
      </button>
    </StyledSolo>
  );
}
