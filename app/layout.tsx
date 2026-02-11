import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Providers } from "./providers";

import { AppContext } from "@/contexts/AppContext";

import ScrollToTop from "@/components/common/ScrollToTop";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import WebPlayerControls from "@/components/Music/WebPlayerControls";
import ThemeProvider from "@/components/Theme/ThemeProvider";

import "@/styles/tailwind.css";
import "@/styles/globals.scss";

// Site Metadata Constants (DRY)
const SITE_NAME = "Inside The Cranium";
const SITE_URL = "https://insidethecranium.io";
const SITE_TITLE = "Inside The Cranium - Discover Curated Spotify Playlists";
const SITE_DESCRIPTION =
  "A directory to Jeff's Spotify. Explore curated playlists, discover new music, and dive into my personal music showcase featuring Spotify integration.";
const SITE_DESCRIPTION_SHORT =
  "A directory to Jeff's Spotify. Explore curated playlists, discover new music, and dive into my personal music showcase.";
const OG_IMAGE = "/Images/og.png";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "spotify playlists",
    "music discovery",
    "curated playlists",
    "music showcase",
    "spotify curator",
    "music recommendations",
    "playlist curation",
    "jeff's music",
  ],
  authors: [{ name: "Jeff" }],
  creator: "Jeff",
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION_SHORT,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "music",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppContext>
              <Navbar />
              {children}
              <Footer />
              <ScrollToTop />
              {/* <WebPlayerControls /> */}
            </AppContext>
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
