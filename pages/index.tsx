import Head from "next/head";
import styled from "styled-components";
import Solo from "./components/Solo";

const StyledHome = styled.div``;

export default function Home() {
  return (
    <StyledHome>
      <Head>
        <title>Inside The Cranium</title>
        <meta name="description" content="A little side project by Jeff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Solo />
      </main>
    </StyledHome>
  );
}
