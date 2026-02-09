import { Clock, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-linear-to-b from-gray-50 via-white to-gray-50 dark:from-black dark:via-black dark:to-black">
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 30%, rgba(61, 56, 245, 0.08) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 blur-3xl rounded-full opacity-50"
                style={{ backgroundColor: "rgba(61, 56, 245, 0.3)" }}
              />
              <div
                className="relative p-6 sm:p-8 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #3d38f5 0%, #8b87ff 100%)",
                }}
              >
                <Clock className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <Sparkles
                className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse"
                style={{ color: "#8b87ff" }}
              />
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #3d38f5, #8b87ff, #3d38f5)",
                  backgroundSize: "200% auto",
                }}
              >
                {title}
              </h1>
              <Sparkles
                className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse"
                style={{ color: "#8b87ff" }}
              />
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              A new experience is on the horizon
            </p>
          </div>

          {/* Description (if provided) */}
          {description && (
            <div className="bg-gray-100 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="pt-8 flex flex-col sm:flex-row items-stretch justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: "#3d38f5",
                boxShadow: "0 10px 40px rgba(61, 56, 245, 0.3)",
              }}
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Return to Home</span>
            </Link>

            <Link
              href="/playlists"
              className="flex items-center justify-center space-x-2 px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 rounded-full transition-all duration-300 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <span>Browse Playlists</span>
            </Link>
          </div>

          {/* Footer note */}
          <div className="pt-12">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
              Stay tuned for updates
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
