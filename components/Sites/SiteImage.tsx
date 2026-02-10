"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Globe } from "lucide-react";

interface SiteImageProps {
  url: string;
  name: string;
  customImageUrl?: string;
  preferFavicon?: boolean;
  loadDelay?: number; // Delay in ms before attempting to load
}

export default function SiteImage({
  url,
  name,
  customImageUrl,
  preferFavicon,
  loadDelay = 0,
}: SiteImageProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(loadDelay === 0);

  // Stagger image loading to avoid rate limits
  useEffect(() => {
    if (loadDelay > 0) {
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, loadDelay);
      return () => clearTimeout(timer);
    }
  }, [loadDelay]);

  const domain = new URL(url).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
  const screenshotUrl = `/api/screenshot?url=${encodeURIComponent(url)}`;

  // Build fallback chain based on preferFavicon flag
  let imageSources: string[];

  if (customImageUrl) {
    // Custom image always first
    imageSources = preferFavicon
      ? [customImageUrl, faviconUrl, screenshotUrl]
      : [customImageUrl, screenshotUrl, faviconUrl];
  } else {
    // No custom image - use preferFavicon flag to determine order
    imageSources = preferFavicon
      ? [faviconUrl, screenshotUrl] // Favicon first for high-quality brand icons
      : [screenshotUrl, faviconUrl]; // Screenshot first for most sites
  }

  const currentSource = imageSources[currentSourceIndex];

  const handleError = () => {
    // Try next source
    if (currentSourceIndex < imageSources.length - 1) {
      setCurrentSourceIndex(currentSourceIndex + 1);
    } else {
      // All sources failed, show globe
      setHasError(true);
    }
  };

  const handleLoad = () => {
    // Image loaded successfully
    setHasError(false);
  };

  if (hasError || !currentSource) {
    // Final fallback: Globe icon
    return (
      <div className="relative flex aspect-video w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10">
        <Globe className="h-12 w-12 text-gray-300 dark:text-gray-600" />
      </div>
    );
  }

  // Show loading state if we're waiting
  if (!shouldLoad) {
    return (
      <div className="relative flex aspect-video w-full items-center justify-center bg-gray-100 dark:bg-white/5">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-transparent dark:border-gray-600 dark:border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-white/5">
      <Image
        src={currentSource}
        alt={`${name} preview`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-contain p-4 transition-transform duration-300 group-hover:scale-102"
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={currentSource.includes("/api/screenshot")}
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/30 dark:to-black/30" />
    </div>
  );
}
