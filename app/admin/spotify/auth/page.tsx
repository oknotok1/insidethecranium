"use client";

import { useState, useEffect } from "react";

export default function SpotifyAuthPage() {
  // Note: CLIENT_ID is public and safe to expose (it's used in browser anyway)
  const [clientId] = useState(process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "");
  const [redirectUri] = useState(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/spotify/auth/callback`,
  );

  // Set document title
  useEffect(() => {
    document.title = "Admin | Spotify Authentication";
  }, []);


  const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
  ];

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&scope=${encodeURIComponent(scopes.join(" "))}`;

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="mb-4 text-3xl sm:mb-6 sm:text-4xl md:text-5xl">
            Spotify Authorization
          </h1>
          <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
            Manage Spotify API authentication and refresh tokens
          </p>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            Required Setup
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Before clicking the button below, make sure you've added this
            redirect URI to your Spotify app settings:
          </p>
          <ol className="list-inside list-decimal space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              Go to{" "}
              <a
                href="https://developer.spotify.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3d38f5] hover:underline dark:text-[#8b87ff]"
              >
                Spotify Developer Dashboard
              </a>
            </li>
            <li>Click on your app</li>
            <li>Click "Edit Settings"</li>
            <li>
              Under "Redirect URIs", add:{" "}
              <code className="rounded bg-gray-200 px-2 py-1 font-mono text-sm text-gray-900 dark:bg-white/10 dark:text-white">
                {redirectUri}
              </code>
            </li>
            <li>Click "Add" then "Save"</li>
          </ol>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            Required Scopes
          </h2>
          <ul className="list-inside list-disc space-y-2">
            {scopes.map((scope) => (
              <li key={scope} className="text-gray-700 dark:text-gray-300">
                <code className="font-mono text-sm text-[#3d38f5] dark:text-[#8b87ff]">
                  {scope}
                </code>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={authUrl}
          className="mb-6 inline-block rounded-full bg-[#3d38f5] px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-[#2e29cc] sm:text-lg dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
        >
          Authorize with Spotify
        </a>

        <div className="rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-white/10 dark:bg-white/5">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
            What happens next?
          </h2>
          <ol className="list-inside list-decimal space-y-2 text-gray-700 dark:text-gray-300">
            <li>You'll be redirected to Spotify to authorize the app</li>
            <li>
              After authorization, you'll be redirected back to a page with
              instructions
            </li>
            <li>Copy and run the provided curl command in your terminal</li>
            <li>
              Update your{" "}
              <code className="rounded bg-gray-200 px-2 py-1 font-mono text-sm text-gray-900 dark:bg-white/10 dark:text-white">
                .env.local
              </code>{" "}
              with the new refresh token
            </li>
            <li>Restart your dev server</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
