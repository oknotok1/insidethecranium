"use client";

import { Clock, Key, LogOut, RefreshCw, Trash2, X } from "lucide-react";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

import Link from "next/link";

// Types for revalidation history
interface RevalidationEvent {
  id: string;
  tag: string;
  timestamp: string;
  action: "refresh" | "purge-all";
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<string | null>(null);
  const [buildTime, setBuildTime] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [revalidationHistory, setRevalidationHistory] = useState<
    RevalidationEvent[]
  >([]);
  const [tagRefreshTimes, setTagRefreshTimes] = useState<
    Record<string, string>
  >({});

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

  // Helper functions for revalidation history
  const fetchHistory = async () => {
    if (status !== "authenticated") return;

    try {
      const response = await fetch("/api/admin/history");

      if (response.ok) {
        const data = await response.json();
        setRevalidationHistory(data.history || []);
      }
    } catch (error) {
      console.error("Failed to fetch revalidation history:", error);
    }
  };

  const clearHistory = async () => {
    if (status !== "authenticated") return;

    if (!confirm("Are you sure you want to clear the revalidation history?"))
      return;

    try {
      const response = await fetch("/api/admin/history", {
        method: "DELETE",
      });

      if (response.ok) {
        setRevalidationHistory([]);
      }
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  const handleRefreshTag = async (tag: string) => {
    if (status !== "authenticated") return;

    setRefreshing(tag);
    setRefreshError(null);
    setLastRefreshed(null);

    try {
      const response = await fetch("/api/admin/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag }),
      });

      if (response.ok) {
        const data = await response.json();
        setLastRefreshed(tag);
        setLastRefreshTime(data.timestamp);
        // Update individual tag refresh time
        setTagRefreshTimes((prev) => ({
          ...prev,
          [tag]: data.timestamp,
        }));
        console.log(`✓ Cache revalidated: ${tag} at ${data.timestamp}`);
        // Refresh history to show the new event
        setTimeout(() => fetchHistory(), 500);
        // Auto-hide success message after 10 seconds
        setTimeout(() => {
          setLastRefreshed(null);
          setLastRefreshTime(null);
        }, 10000);
      } else {
        setRefreshError(`Failed to refresh ${tag}`);
      }
    } catch (error) {
      console.error("Failed to refresh tag:", error);
      setRefreshError(`Network error refreshing ${tag}`);
    } finally {
      setRefreshing(null);
    }
  };

  const handlePurgeAll = async () => {
    if (!confirm("Are you sure you want to purge ALL cache tags?")) return;

    if (status !== "authenticated") return;

    setRefreshing("all");
    setRefreshError(null);
    setLastRefreshed(null);

    try {
      const response = await fetch("/api/admin/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "purge-all" }),
      });

      if (response.ok) {
        const data = await response.json();
        setLastRefreshed("all");
        setLastRefreshTime(data.timestamp);
        // Update all tag refresh times
        const allTagTimes: Record<string, string> = {};
        data.tags?.forEach((tag: string) => {
          allTagTimes[tag] = data.timestamp;
        });
        setTagRefreshTimes((prev) => ({
          ...prev,
          ...allTagTimes,
        }));
        console.log(
          `✓ All cache tags purged (${data.tags?.length || 0} tags) at ${data.timestamp}`,
        );
        // Refresh history to show the new event
        setTimeout(() => fetchHistory(), 500);
        // Auto-hide success message after 10 seconds
        setTimeout(() => {
          setLastRefreshed(null);
          setLastRefreshTime(null);
        }, 10000);
      } else {
        setRefreshError("Failed to purge all cache");
      }
    } catch (error) {
      console.error("Failed to purge cache:", error);
      setRefreshError("Network error purging cache");
    } finally {
      setRefreshing(null);
    }
  };

  // Fetch build info on mount
  useEffect(() => {
    // Fetch build info to show initial cache timestamp
    fetch("/api/admin/build-info")
      .then((res) => res.json())
      .then((data) => {
        setBuildTime(data.buildTime);
        // Set as initial "last refresh time" since cache was populated at build time
        setLastRefreshTime(data.buildTime);
        // Initialize all tag refresh times with build time
        const initialTimes: Record<string, string> = {};
        cacheTags.forEach(({ tag }) => {
          initialTimes[tag] = data.buildTime;
        });
        setTagRefreshTimes(initialTimes);
      })
      .catch((error) => console.error("Failed to fetch build info:", error));
  }, []);

  // Fetch revalidation history when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchHistory();
    }
  }, [status]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <main className="flex flex-col">
        <section className="flex items-center justify-center py-6 sm:py-16 lg:py-20">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#3d38f5] dark:border-gray-700 dark:border-t-[#8b87ff]"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Checking authentication...
            </p>
          </div>
        </section>
      </main>
    );
  }

  // Show Google sign-in if not authenticated
  if (status === "unauthenticated") {
    return (
      <main className="flex flex-col">
        <section className="flex items-center justify-center py-6 sm:py-16 lg:py-20">
          <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                <Key className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in with your Google account to continue
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-white/10 dark:bg-white/5">
              <button
                onClick={() => signIn("google")}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-lg hover:scale-105 active:scale-100 dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-black/30"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>

              <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
                Only authorized accounts can access this dashboard
              </p>
            </div>
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
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
                  Cache Management
                </h1>
                <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
                  Refresh cached data to fetch the latest from Spotify
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs sm:text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {session?.user?.name}
                    </p>
                    <p className="text-gray-500 dark:text-gray-500">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md dark:border-white/20 dark:bg-black/20 dark:text-white dark:hover:bg-black/30"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1 text-xs sm:text-sm">
              {buildTime && (
                <p className="text-gray-500 dark:text-gray-500">
                  <span className="font-medium">Deployed:</span>{" "}
                  <span className="break-all">
                    {new Date(buildTime).toLocaleString()}
                  </span>
                </p>
              )}
              {lastRefreshed && lastRefreshTime && (
                <p className="text-gray-500 dark:text-gray-500">
                  <span className="font-medium">Last manual refresh:</span>{" "}
                  <span className="break-all">
                    {new Date(lastRefreshTime).toLocaleString()}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Cache Controls */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-4 sm:p-6 dark:border-white/10 dark:bg-white/5">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                Cache Controls
              </h2>
              <button
                onClick={handlePurgeAll}
                disabled={refreshing === "all"}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-red-700 hover:shadow-lg hover:scale-105 active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none sm:text-base"
              >
                <Trash2 className="h-4 w-4" />
                <span className="whitespace-nowrap">
                  {refreshing === "all" ? "Purging..." : "Purge All Cache"}
                </span>
              </button>
            </div>

            {/* Success Message */}
            {lastRefreshed && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800/30 dark:bg-green-900/10">
                <p className="text-sm text-green-800 dark:text-green-300">
                  <strong>✓ Cache revalidated successfully!</strong>
                  <br />
                  {lastRefreshed === "all"
                    ? "All cache tags have been cleared."
                    : `The "${lastRefreshed}" cache has been cleared.`}{" "}
                  The next request will fetch fresh data from Spotify.
                  <br />
                  <span className="text-xs opacity-90">
                    Note: You may need to hard refresh pages (⌘+Shift+R /
                    Ctrl+F5) to see updates.
                  </span>
                </p>
              </div>
            )}

            {/* Error Message */}
            {refreshError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-900/10">
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>✗ Error:</strong> {refreshError}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cacheTags.map(({ tag, label, description }) => (
                <div
                  key={tag}
                  className="rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md dark:border-white/10 dark:bg-black/20 dark:hover:border-white/20"
                >
                  <div className="mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {description}
                    </p>
                    {tagRefreshTimes[tag] && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                        Last refreshed:{" "}
                        {new Date(tagRefreshTimes[tag]).toLocaleString(
                          undefined,
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRefreshTag(tag)}
                    disabled={refreshing === tag}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3d38f5] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#2e29cc] hover:shadow-lg hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
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

          {/* Revalidation History */}
          <div className="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-4 sm:p-6 dark:border-white/10 dark:bg-white/5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                  Revalidation History
                </h2>
              </div>
              {revalidationHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 self-start text-sm text-red-600 transition-colors hover:text-red-700 sm:self-auto dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                  <span className="sm:inline">Clear History</span>
                </button>
              )}
            </div>

            {revalidationHistory.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-500">
                No revalidation events yet. Refresh a cache tag to see it logged
                here.
              </p>
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {revalidationHistory.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-black/20"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <RefreshCw className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                      <div className="min-w-0">
                        <span className="wrap-break-word font-medium text-gray-900 dark:text-white">
                          {event.action === "purge-all"
                            ? "Purged All Caches"
                            : `Refreshed: ${event.tag}`}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 sm:shrink-0 dark:text-gray-500">
                      {new Date(event.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
              Note: History is stored in server memory and resets on deployment.
              Keeps last 100 events.
            </p>
          </div>

          {/* Info Note */}
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 sm:p-6 dark:border-blue-800/30 dark:bg-blue-900/10">
            <p className="mb-2 text-xs font-semibold text-blue-800 sm:text-sm dark:text-blue-300">
              How Cache Revalidation Works:
            </p>
            <ul className="list-inside list-disc space-y-1 text-xs text-blue-800 sm:text-sm dark:text-blue-300">
              <li className="pl-1">
                Clicking "Refresh" clears Next.js's server-side Data Cache for
                that tag
              </li>
              <li className="pl-1">
                The next request will fetch fresh data from Spotify API
              </li>
              <li className="pl-1">
                <strong>Important:</strong> You must hard refresh pages
                (⌘+Shift+R on Mac, Ctrl+F5 on Windows) to see the updated data
              </li>
              <li className="pl-1">
                For detailed API logs and monitoring, check your Vercel
                dashboard under the "Logs" tab
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="rounded-lg border border-gray-200 bg-gray-100 p-4 sm:p-6 dark:border-white/10 dark:bg-white/5">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
              Quick Links
            </h2>
            <Link
              href="/admin/spotify/auth"
              className="inline-flex items-center gap-2 rounded-lg bg-[#3d38f5] px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#2e29cc] hover:shadow-lg hover:scale-105 active:scale-100 sm:text-base dark:bg-[#8b87ff] dark:hover:bg-[#7b77ef]"
            >
              <Key className="h-4 w-4" />
              <span className="whitespace-nowrap">Spotify Authorization Helper</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
