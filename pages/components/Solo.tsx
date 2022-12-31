import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import soloData from "./data/solo";

const StyledSolo = Styled.div`
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
    color: #282c34;
    background-color: #fff;
    border: 1px solid #282c34;
    border-radius: 12px;
    margin-top: 1rem;
    padding: 6px 12px;
  }

  button:hover {
    cursor: pointer;
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
  const [track, setTrack] = useState(soloData[1]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Randomise track on page load
  useEffect(() => {
    setTrack(soloData[Math.floor(Math.random() * soloData.length)]);
  }, []);

  const toggleLink = () => {
    window.open(
      "https://open.spotify.com/user/21h6osgmy2twlu7ichm7ygfhq?si=96fadda3e46144dc"
    );
  };

  const randomise = () => {
    setTrack(soloData[Math.floor(Math.random() * soloData.length)]);
  };

  return (
    <StyledSolo>
      <a href="#" id="randomise" onClick={randomise}>
        🎲
      </a>
      <h1>Track #{track.id}</h1>
      <p>{today}</p>
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
      <button
        onClick={() => {
          alert(
            "You've already come this far, might as well follow me on Spotify. 🤷🏻‍♀️"
          );
          toggleLink();
        }}
      >
        Click
      </button>
    </StyledSolo>
  );
}
