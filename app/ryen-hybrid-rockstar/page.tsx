import { redirect } from "next/navigation";

export const metadata = {
  title: "Ry-En Hybrid Rockstar",
  description: "Redirecting to Ry-En's Hyrox journey",
};

// Don't cache this page - always check env var fresh
export const revalidate = 0;

export default function RyenHybridRockstarPage() {
  const redirectUrl = process.env.RYEN_HYROX_REDIRECT_URL;

  // Check if env var exists and is not empty
  if (!redirectUrl || redirectUrl.trim() === "") {
    return <RyenHyroxUnavailablePage />;
  }

  // Validate URL format
  try {
    new URL(redirectUrl); // Throws TypeError if invalid URL format
    redirect(redirectUrl);
  } catch {
    return <RyenHyroxUnavailablePage />;
  }
}

function RyenHyroxUnavailablePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <div className="max-w-xl text-center">
        <div className="mb-8 text-7xl" aria-hidden="true">
          💀
        </div>
        <h1 className="mb-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Ry-En entered HYROX with confidence.
        </h1>
        <p className="text-lg leading-8 text-zinc-700 sm:text-xl dark:text-zinc-300">
          HYROX replied, &quot;cute.&quot;
        </p>
      </div>
    </main>
  );
}
