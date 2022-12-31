import React from "react";
import styled from "styled-components";
import useSWR from "swr";

const StyledNowPlaying = styled.div`
  padding: 2rem;

  iframe {
    max-width: 70rem;
  }

  img {
    width: 100%;
  }
`;

export default function NowPlaying() {
  const fetcher = (url: RequestInfo | URL) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/spotify", fetcher);

  const songId = data?.songUrl.split("/").pop();
  const src = `https://open.spotify.com/embed/track/${songId}?utm_source=generator&theme=0`;

  return (
    <StyledNowPlaying>
      {data?.isPlaying ? (
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
      ) : (
        <p className="component font-bold">Not Listening</p>
      )}
    </StyledNowPlaying>
  );
}
