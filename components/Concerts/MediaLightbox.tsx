"use client";

import { useMemo, useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

export interface MediaItem {
  type: "image" | "video";
  src: string;
  alt?: string;
  poster?: string; // For videos
}

interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  initialIndex?: number;
}

export function MediaLightbox({
  isOpen,
  onClose,
  mediaItems,
  initialIndex = 0,
}: MediaLightboxProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Convert media items to lightbox format - memoize to prevent recreating on every render
  const slides = useMemo(() => 
    mediaItems.map((item) => {
      if (item.type === "video") {
        return {
          type: "video" as const,
          sources: [
            {
              src: item.src,
              type: "video/mp4",
            },
          ],
          poster: item.poster,
        };
      }
      return {
        src: item.src,
        alt: item.alt || "",
      };
    }), [mediaItems]);

  // Responsive thumbnail sizes - small square thumbnails
  const thumbnailConfig = isMobile
    ? { width: 32, height: 32, gap: 4 }  // Tiny squares on mobile
    : { width: 70, height: 70, gap: 10 }; // Small squares on desktop

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      index={initialIndex}
      plugins={[Thumbnails, Video]}
      thumbnails={{
        position: "bottom",
        width: thumbnailConfig.width,
        height: thumbnailConfig.height,
        border: 2,
        borderRadius: 4,
        padding: 0,
        gap: thumbnailConfig.gap,
        showToggle: false,
        vignette: false,
      }}
      video={{
        controls: true,
        autoPlay: false,
      }}
      carousel={{
        finite: false,
        preload: 2,
        spacing: 0,
        padding: isMobile ? 0 : "16px",
      }}
      animation={{
        fade: 250,
        swipe: 250,
      }}
      controller={{
        closeOnBackdropClick: true,
        closeOnPullDown: true,
        closeOnPullUp: false,
      }}
      styles={{
        container: {
          backgroundColor: "rgba(0, 0, 0, 0.95)",
        },
        thumbnailsContainer: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          padding: isMobile ? "8px 0" : "12px 0",
        },
        thumbnail: {
          border: "2px solid transparent",
          borderRadius: "4px",
          transition: "border-color 0.2s ease",
          overflow: "hidden",
        },
        slide: {
          padding: isMobile ? "0" : "20px 0",
        },
      }}
      render={{
        thumbnail: ({ slide, rect }) => {
          const src = slide.type === "video" 
            ? slide.poster || slide.sources?.[0]?.src
            : slide.src;
          const alt = "alt" in slide ? slide.alt : "Video thumbnail";
          
          return (
            <img
              src={src}
              alt={alt || ""}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          );
        },
      }}
    />
  );
}
