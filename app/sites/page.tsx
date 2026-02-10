import SitesClient from "./client";

export const metadata = {
  title: "Recommended Sites - Inside The Cranium",
  description:
    "My favorite platforms for discovering and exploring music. From streaming services to analytics tools, these sites have shaped my musical journey.",
};

export default function SitesPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      <SitesClient />
    </main>
  );
}
