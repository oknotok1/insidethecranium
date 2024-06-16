import "@/styles/globals.scss";
import "@/styles/custom.scss";
import type { AppProps } from "next/app";
import { AppContext } from "@/contexts/AppContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContext>
      <Component {...pageProps} />
    </AppContext>
  );
}
