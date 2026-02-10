"use client";

import { Globe } from "lucide-react";

import { useState } from "react";

import Image from "next/image";

const FAVICON_API = "https://www.google.com/s2/favicons";
const FAVICON_SIZE = 256;

// Helper to build favicon URL
const getFaviconUrl = (url: string): string => {
  const domain = new URL(url).hostname;
  return `${FAVICON_API}?domain=${domain}&sz=${FAVICON_SIZE}`;
};

// Helper to build screenshot URL
const getScreenshotUrl = (url: string): string =>
  `/api/screenshot?url=${encodeURIComponent(url)}`;

// Helper to build image source fallback chain
const buildImageSources = (
  url: string,
  customImageUrl?: string,
  preferFavicon?: boolean,
): string[] => {
  const faviconUrl = getFaviconUrl(url);
  const screenshotUrl = getScreenshotUrl(url);

  if (customImageUrl) {
    return preferFavicon
      ? [customImageUrl, faviconUrl, screenshotUrl]
      : [customImageUrl, screenshotUrl, faviconUrl];
  }

  return preferFavicon
    ? [faviconUrl, screenshotUrl]
    : [screenshotUrl, faviconUrl];
};

export default function SiteImage({
  url,
  name,
  customImageUrl,
  preferFavicon,
}: {
  url: string;
  name: string;
  customImageUrl?: string;
  preferFavicon?: boolean;
}) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const imageSources = buildImageSources(url, customImageUrl, preferFavicon);

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
