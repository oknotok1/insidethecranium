import type { ReactNode } from "react";

export const metadata = {
  title: "Ry-En Hybrid Rockstar",
  description: "Redirecting to Ry-En's Hyrox journey",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RyenHybridRockstarLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <style>{`
        nav,
        footer {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  );
}
