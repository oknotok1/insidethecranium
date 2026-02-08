"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Trash2, Lock, Key } from "lucide-react";
import Link from "next/link";

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
        <section className="py-6 sm:py-16 lg:py-20 flex items-center justify-center">
          <div className="max-w-md w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enter password to continue
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 p-6"
            >
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#3d38f5] dark:focus:ring-[#8b87ff] focus:border-transparent"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>

              {authError && (
                <div className="mb-4 p-3 rounded bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-2 px-4 bg-[#3d38f5] hover:bg-[#2e29cc] dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              Cache Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Refresh cached data to fetch the latest from Spotify
            </p>
          </div>

          {/* Cache Controls */}
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Cache Controls
              </h2>
              <button
                onClick={handlePurgeAll}
                disabled={refreshing === "all"}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {refreshing === "all" ? "Purging..." : "Purge All Cache"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cacheTags.map(({ tag, label, description }) => (
                <div
                  key={tag}
                  className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg p-4"
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#3d38f5] hover:bg-[#2e29cc] dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef] text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${refreshing === tag ? "animate-spin" : ""}`}
                    />
                    {refreshing === tag ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h2>
            <Link
              href="/admin/spotify/auth"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#3d38f5] hover:bg-[#2e29cc] dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef] text-white rounded-lg font-medium transition-colors"
            >
              <Key className="w-4 h-4" />
              Spotify Authorization Helper
            </Link>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg p-4">
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
