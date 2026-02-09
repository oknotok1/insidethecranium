"use client";

import { useState } from "react";
import Image from "next/image";
import { Globe } from "lucide-react";

interface SiteImageProps {
  url: string;
  name: string;
  customImageUrl?: string;
  preferFavicon?: boolean;
}

export default function SiteImage({ url, name, customImageUrl, preferFavicon }: SiteImageProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

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
      <div className="relative w-full aspect-video bg-linear-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center">
        <Globe className="w-12 h-12 text-gray-300 dark:text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gray-100 dark:bg-white/5 overflow-hidden">
      <Image
        src={currentSource}
        alt={`${name} preview`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-contain p-4 group-hover:scale-102 transition-transform duration-300"
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={currentSource.includes('/api/screenshot')}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-white/30 dark:to-black/30 pointer-events-none" />
    </div>
  );
}
