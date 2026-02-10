import { ArrowLeft, Clock, Sparkles } from "lucide-react";

import Link from "next/link";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export default function ComingSoonPage({
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-linear-to-b from-gray-50 via-white to-gray-50 dark:from-black dark:via-black dark:to-black">
      {/* Subtle gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 30%, rgba(61, 56, 245, 0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full opacity-50 blur-3xl"
                style={{ backgroundColor: "rgba(61, 56, 245, 0.3)" }}
              />
              <div
                className="relative rounded-full p-6 sm:p-8"
                style={{
                  background:
                    "linear-gradient(135deg, #3d38f5 0%, #8b87ff 100%)",
                }}
              >
                <Clock className="h-16 w-16 text-white sm:h-20 sm:w-20" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <Sparkles
                className="h-5 w-5 animate-pulse sm:h-6 sm:w-6"
                style={{ color: "#8b87ff" }}
              />
              <h1
                className="bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #3d38f5, #8b87ff, #3d38f5)",
                  backgroundSize: "200% auto",
                }}
              >
                {title}
              </h1>
              <Sparkles
                className="h-5 w-5 animate-pulse sm:h-6 sm:w-6"
                style={{ color: "#8b87ff" }}
              />
            </div>
            <p className="mx-auto max-w-2xl text-lg text-gray-700 sm:text-xl md:text-2xl dark:text-gray-300">
              A new experience is on the horizon
            </p>
          </div>

          {/* Description (if provided) */}
          {description && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-gray-100 p-6 backdrop-blur-sm sm:p-8 dark:border-white/10 dark:bg-white/5">
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="flex w-full flex-col items-stretch justify-center gap-4 px-4 pt-8 sm:w-auto sm:flex-row sm:px-0">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 rounded-full px-6 py-3 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:px-8 sm:py-4"
              style={{
                backgroundColor: "#3d38f5",
                boxShadow: "0 10px 40px rgba(61, 56, 245, 0.3)",
              }}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Return to Home</span>
            </Link>

            <Link
              href="/playlists"
              className="flex items-center justify-center space-x-2 rounded-full border border-gray-300 bg-gray-200 px-6 py-3 text-sm text-gray-700 transition-all duration-300 hover:bg-gray-300 hover:text-gray-900 sm:px-8 sm:py-4 sm:text-base dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <span>Browse Playlists</span>
            </Link>
          </div>

          {/* Footer note */}
          <div className="pt-12">
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-500">
              Stay tuned for updates
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
