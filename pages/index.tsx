import Head from "next/head";
import Solo from "./components/Solo";

export default function Home() {
  return (
    <>
      <Head>
        <title>Inside The Cranium</title>
        <meta name="description" content="A little side project by Jeff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        <Solo />
      </main>
    </>
  );
}
