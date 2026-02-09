"use client";

import { useState } from "react";
import { Globe } from "lucide-react";
import { getSiteImageSources } from "@/utils/site-image";

interface SiteImageProps {
  url: string;
  name: string;
  customImageUrl?: string;
}

export default function SiteImage({ url, name, customImageUrl }: SiteImageProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Get all possible image sources
  const imageSources = customImageUrl 
    ? [{ type: "direct" as const, url: customImageUrl, priority: 0 }, ...getSiteImageSources(url)]
    : getSiteImageSources(url);

  const currentSource = imageSources[currentSourceIndex];

  const handleError = () => {
    // Try next source
    if (currentSourceIndex < imageSources.length - 1) {
      setCurrentSourceIndex(currentSourceIndex + 1);
    } else {
      // All sources failed, show fallback
      setHasError(true);
    }
  };

  const handleLoad = () => {
    // Image loaded successfully
    setHasError(false);
  };

  if (hasError || !currentSource) {
    // Fallback UI when all image sources fail
    return (
      <div className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center">
        <Globe className="w-12 h-12 text-gray-300 dark:text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-100 dark:bg-white/5 overflow-hidden">
      <img
        src={currentSource.url}
        alt={`${name} preview`}
        className="w-full h-full object-contain p-4"
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 dark:to-black/30 pointer-events-none" />
    </div>
  );
}
