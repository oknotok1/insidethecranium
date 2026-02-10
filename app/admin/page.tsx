"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Key, Lock, RefreshCw, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState<string | null>(null);

  // Available cache tags
  const cacheTags = [
    {
      tag: "playlists",
      label: "Playlists",
      description: "User playlists list",
    },
    { tag: "tracks", label: "Tracks", description: "Track metadata" },
    {
      tag: "artist-genres",
      label: "Artist Genres",
      description: "Artist genre data",
    },
    {
      tag: "curated-tracks",
      label: "Curated Tracks",
      description: "Homepage featured tracks",
    },
    {
      tag: "recently-played",
      label: "Recently Played",
      description: "Last played track",
    },
    {
      tag: "spotify-token",
      label: "Access Token",
      description: "Spotify auth token",
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setAuthError("");
    setLoading(true);

    try {
      // Test authentication by attempting a refresh
      const response = await fetch("/api/admin/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag: "spotify-token" }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminPassword", password);
      } else {
        setAuthError("Invalid password");
      }
    } catch (error) {
      setAuthError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshTag = async (tag: string) => {
    const authPw = sessionStorage.getItem("adminPassword");
    if (!authPw) return;

    setRefreshing(tag);

    try {
      await fetch("/api/admin/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authPw}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag }),
      });
    } catch (error) {
      console.error("Failed to refresh tag:", error);
    } finally {
      setRefreshing(null);
    }
  };

  const handlePurgeAll = async () => {
    if (!confirm("Are you sure you want to purge ALL cache tags?")) return;

    const authPw = sessionStorage.getItem("adminPassword");
    if (!authPw) return;

    setRefreshing("all");

    try {
      await fetch("/api/admin/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authPw}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "purge-all" }),
      });
    } catch (error) {
      console.error("Failed to purge cache:", error);
    } finally {
      setRefreshing(null);
    }
  };

  // Check for saved auth on mount
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <main className="flex flex-col">
        <section className="flex items-center justify-center py-6 sm:py-16 lg:py-20">
          <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <Lock className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enter password to continue
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-[#3d38f5] dark:border-white/20 dark:bg-black/20 dark:text-white dark:focus:ring-[#8b87ff]"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="mb-4 rounded border border-red-200 bg-red-100 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full rounded-lg bg-[#3d38f5] px-4 py-2 font-medium text-white transition-colors hover:bg-[#2e29cc] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-col">
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              Cache Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Refresh cached data to fetch the latest from Spotify
            </p>
          </div>

          {/* Cache Controls */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-white/10 dark:bg-white/5">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Cache Controls
              </h2>
              <button
                onClick={handlePurgeAll}
                disabled={refreshing === "all"}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {refreshing === "all" ? "Purging..." : "Purge All Cache"}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cacheTags.map(({ tag, label, description }) => (
                <div
                  key={tag}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-black/20"
                >
                  <div className="mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRefreshTag(tag)}
                    disabled={refreshing === tag}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3d38f5] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2e29cc] disabled:opacity-50 dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${refreshing === tag ? "animate-spin" : ""}`}
                    />
                    {refreshing === tag ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h2>
            <Link
              href="/admin/spotify/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3d38f5] px-4 py-2 font-medium text-white transition-colors hover:bg-[#2e29cc] dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
            >
              <Key className="h-4 w-4" />
              Spotify Authorization Helper
            </Link>
          </div>

          {/* Info Note */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/30 dark:bg-blue-900/10">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> For detailed API logs and monitoring, check
              your Vercel dashboard under the "Logs" tab.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
