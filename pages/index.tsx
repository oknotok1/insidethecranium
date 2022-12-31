import Head from "next/head";
// import Solo from "./components/Solo";

import Styled from "styled-components";

const StyledMain = Styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default function Home() {
  return (
    <>
      <Head>
        <title>Inside The Cranium</title>
        <meta name="description" content="A little side project by Jeff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <StyledMain>
        <h1>Inside The Cranium</h1>
        {/* <Solo /> */}
      </StyledMain>
    </>
  );
}
