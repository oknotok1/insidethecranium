"use client";

import Link from "next/link";

import { ArrowRight, Clock, Sparkles } from "lucide-react";

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-2xl border border-gray-200 sm:rounded-3xl dark:border-white/10"
          style={{
            background:
              "linear-gradient(135deg, rgba(61, 56, 245, 0.08) 0%, rgba(139, 135, 255, 0.04) 50%, rgba(61, 56, 245, 0.08) 100%)",
          }}
        >
          {/* Decorative blur effects */}
          <div
            className="absolute top-0 left-1/4 h-64 w-64 rounded-full opacity-30 blur-3xl sm:h-96 sm:w-96"
            style={{ backgroundColor: "rgba(61, 56, 245, 0.3)" }}
          />
          <div
            className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full opacity-20 blur-3xl sm:h-96 sm:w-96"
            style={{ backgroundColor: "rgba(139, 135, 255, 0.3)" }}
          />

          <div className="relative px-6 py-12 sm:px-8 sm:py-16 md:py-20">
            <div className="space-y-6 text-center">
              {/* Icon */}
              <div className="flex justify-center">
                <div
                  className="rounded-xl p-3 sm:rounded-2xl sm:p-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #3d38f5 0%, #8b87ff 100%)",
                  }}
                >
                  <Clock className="h-10 w-10 text-white sm:h-12 sm:w-12" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles
                    className="h-4 w-4 animate-pulse sm:h-5 sm:w-5"
                    style={{ color: "#8b87ff" }}
                  />
                  <h2
                    className="bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #8b87ff, #3d38f5, #8b87ff)",
                    }}
                  >
                    {title}
                  </h2>
                  <Sparkles
                    className="h-4 w-4 animate-pulse sm:h-5 sm:w-5"
                    style={{ color: "#8b87ff" }}
                  />
                </div>
                <p className="mx-auto max-w-2xl text-base text-gray-700 sm:text-lg dark:text-gray-300">
                  {subtitle}
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href={href}
                  className="group inline-flex items-center space-x-2 rounded-lg bg-gray-100 px-6 py-3 text-gray-900 transition-all duration-300 hover:bg-gray-200 sm:px-8 sm:py-4 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <span className="text-sm sm:text-base">
                    Explore Concert Memories
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
