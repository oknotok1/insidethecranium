"use client";

import { useState } from "react";

export default function SpotifyAuthPage() {
  const [clientId] = useState("e40037a58f3f4b9f91aa4622a13bdac5");
  const [redirectUri] = useState("http://127.0.0.1:3000/api/callback");

  const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
  ];

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}`;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 dark:text-white">
          Spotify Authorization Helper
        </h1>

        <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-6 mb-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Required Setup
          </h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            Before clicking the button below, make sure you've added this redirect URI to your Spotify app settings:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              Go to{" "}
              <a
                href="https://developer.spotify.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3d38f5] dark:text-[#8b87ff] hover:underline"
              >
                Spotify Developer Dashboard
              </a>
            </li>
            <li>Click on your app</li>
            <li>Click "Edit Settings"</li>
            <li>
              Under "Redirect URIs", add:{" "}
              <code className="px-2 py-1 rounded bg-gray-200 dark:bg-white/10 text-sm font-mono text-gray-900 dark:text-white">
                {redirectUri}
              </code>
            </li>
            <li>Click "Add" then "Save"</li>
          </ol>
        </div>

        <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-6 mb-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Required Scopes
          </h2>
          <ul className="list-disc list-inside space-y-2">
            {scopes.map((scope) => (
              <li key={scope} className="text-gray-700 dark:text-gray-300">
                <code className="text-[#3d38f5] dark:text-[#8b87ff] font-mono text-sm">
                  {scope}
                </code>
              </li>
            ))}
          </ul>
        </div>

        <a
          href={authUrl}
          className="inline-block bg-[#3d38f5] hover:bg-[#2e29cc] dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef] text-white px-8 py-4 rounded-full text-base sm:text-lg font-semibold transition-colors mb-6"
        >
          Authorize with Spotify
        </a>

        <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-6 border border-gray-200 dark:border-white/10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            What happens next?
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>You'll be redirected to Spotify to authorize the app</li>
            <li>After authorization, you'll be redirected back to a page with instructions</li>
            <li>Copy and run the provided curl command in your terminal</li>
            <li>
              Update your{" "}
              <code className="px-2 py-1 rounded bg-gray-200 dark:bg-white/10 text-sm font-mono text-gray-900 dark:text-white">
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
