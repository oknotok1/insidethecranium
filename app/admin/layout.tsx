import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false, // Do not index admin pages
    follow: false, // Do not follow links on admin pages
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
