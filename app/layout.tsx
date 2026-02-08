import "@/styles/tailwind.css";
import "@/styles/globals.scss";
import { AppContext } from "@/contexts/AppContext";
import ThemeProvider from "@/components/Theme/ThemeProvider";
import Navbar from "@/components/(Layout)/Navbar";
import Footer from "@/components/(Layout)/Footer";
import WebPlayerControls from "@/components/WebPlayerControls";
import ScrollToTop from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "Inside The Cranium",
  description: "A directory to Jeff's Spotify",
  icons: {
    icon: "/favicon.ico",
  },
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
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
