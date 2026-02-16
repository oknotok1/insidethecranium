"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { GalleryImage, VideoItem } from "@/types/contentful";
import { MediaLightbox, type MediaItem } from "./MediaLightbox";

interface ConcertMediaGridProps {
  concertSlug: string;
  concertTitle: string;
  galleryImages: GalleryImage[];
  videos: VideoItem[];
  spacing?: "normal" | "tight"; // "normal" for gap-4, "tight" for gap-2 sm:gap-4
  maxItems?: number; // Maximum number of items to display (undefined = show all)
}

export function ConcertMediaGrid({
  concertSlug,
  concertTitle,
  galleryImages,
  videos,
  spacing = "normal",
  maxItems,
}: ConcertMediaGridProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (galleryImages.length === 0 && videos.length === 0) {
    return null;
  }

  // Combine all media items for the lightbox (full collection)
  const allMediaItems: MediaItem[] = [
    ...galleryImages.map((img) => ({
      type: "image" as const,
      src: img.url,
      alt: img.alt,
    })),
    ...videos.map((vid) => ({
      type: "video" as const,
      src: vid.url,
      alt: vid.fileName || "Concert video",
      poster: vid.url.replace(/\.[^/.]+$/, "") + ".jpg", // Try to use a poster frame if available
    })),
  ];

  // Limit displayed items if maxItems is set
  const displayedImages = maxItems ? galleryImages.slice(0, maxItems) : galleryImages;
  const remainingSlots = maxItems ? Math.max(0, maxItems - displayedImages.length) : videos.length;
  const displayedVideos = maxItems ? videos.slice(0, remainingSlots) : videos;

  const handleMediaClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const gapClass = spacing === "tight" ? "gap-2 sm:gap-4" : "gap-4";

  return (
    <>
      <div className={`grid grid-cols-2 ${gapClass} sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`}>
        {/* Gallery Images */}
        {displayedImages.map((image, idx) => (
          <button
            key={`img-${idx}`}
            onClick={() => handleMediaClick(idx)}
            type="button"
            className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-lg bg-gray-200 transition-all hover:ring-2 hover:ring-[#3d38f5] dark:bg-white/5"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {image.alt && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="line-clamp-2 text-xs text-white">{image.alt}</p>
                </div>
              </div>
            )}
          </button>
        ))}

        {/* Videos */}
        {displayedVideos.map((video, idx) => {
          const videoIndex = displayedImages.length + idx;
          return (
            <button
              key={`vid-${idx}`}
              onClick={() => handleMediaClick(videoIndex)}
              type="button"
              className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-lg bg-gray-200 transition-all hover:ring-2 hover:ring-[#3d38f5] dark:bg-white/5"
            >
              <video
                src={video.url}
                className="h-full w-full object-cover"
                preload="metadata"
              />
              {/* Video indicator */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors group-hover:bg-[#3d38f5] sm:h-16 sm:w-16">
                  <Play className="ml-1 h-6 w-6 fill-current text-gray-900 group-hover:text-white sm:h-8 sm:w-8" />
                </div>
              </div>
              {/* Click hint */}
              <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                <div className="rounded-full bg-black/60 px-2 py-1 backdrop-blur-sm">
                  <span className="text-xs text-white">Play</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox for full-screen viewing */}
      <MediaLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        mediaItems={allMediaItems}
        initialIndex={lightboxIndex}
      />
    </>
  );
}
