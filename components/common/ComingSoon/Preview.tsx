"use client";

import Link from "next/link";
import { Clock, ArrowRight, Sparkles } from "lucide-react";

interface ComingSoonPreviewProps {
  title: string;
  subtitle?: string;
  href?: string;
}

export default function ComingSoonPreview({
  title,
  subtitle = "A new experience coming soon",
  href = "/concerts",
}: ComingSoonPreviewProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/10"
          style={{
            background:
              "linear-gradient(135deg, rgba(61, 56, 245, 0.08) 0%, rgba(139, 135, 255, 0.04) 50%, rgba(61, 56, 245, 0.08) 100%)",
          }}
        >
          {/* Decorative blur effects */}
          <div
            className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: "rgba(61, 56, 245, 0.3)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "rgba(139, 135, 255, 0.3)" }}
          />

          <div className="relative px-6 py-12 sm:px-8 sm:py-16 md:py-20">
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className="p-3 sm:p-4 rounded-xl sm:rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #3d38f5 0%, #8b87ff 100%)",
                  }}
                >
                  <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles
                    className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse"
                    style={{ color: "#8b87ff" }}
                  />
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #8b87ff, #3d38f5, #8b87ff)",
                    }}
                  >
                    {title}
                  </h2>
                  <Sparkles
                    className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse"
                    style={{ color: "#8b87ff" }}
                  />
                </div>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                  {subtitle}
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href={href}
                  className="inline-flex items-center space-x-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-50 dark:border-white/[0.025] hover:border-gray-100 dark:hover:border-white/5 text-gray-900 dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg shadow-card transition-all duration-300 group"
                >
                  <span className="text-sm sm:text-base">Explore Concert Memories</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
