import "@/styles/tailwind.css";
import "@/styles/globals.scss";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { AppContext } from "@/contexts/AppContext";
import ThemeProvider from "@/components/Theme/ThemeProvider";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import WebPlayerControls from "@/components/Music/WebPlayerControls";
import ScrollToTop from "@/components/common/ScrollToTop";

export const metadata = {
  metadataBase: new URL("https://insidethecranium.io"),
  title: {
    default: "Inside The Cranium",
    template: "%s | Inside The Cranium",
  },
  description:
    "A directory to Jeff's Spotify. Explore curated playlists, discover new music, and dive into my personal music showcase featuring Spotify integration.",
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
  publisher: "Inside The Cranium",
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
    title: "Inside The Cranium",
    description:
      "A directory to Jeff's Spotify. Explore curated playlists, discover new music, and dive into my personal music showcase featuring Spotify integration.",
    url: "https://insidethecranium.io",
    siteName: "Inside The Cranium",
    images: [
      {
        url: "/Images/og.png",
        width: 1200,
        height: 630,
        alt: "Inside The Cranium - Music Showcase & Discovery",
      },
    ],
    locale: "en_SG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inside The Cranium",
    description:
      "A directory to Jeff's Spotify. Explore curated playlists, discover new music, and dive into my personal music showcase.",
    images: ["/Images/og.png"],
  },
  alternates: {
    canonical: "https://insidethecranium.io",
  },
  category: "music",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
      </body>
    </html>
  );
}
