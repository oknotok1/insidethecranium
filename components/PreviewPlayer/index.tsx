"use client";

import { useEffect, useState } from "react";

import { DesktopMiniPlayer } from "./DesktopMiniPlayer";
import { MobileDrawerPlayer } from "./MobileDrawerPlayer";

export function PreviewPlayer() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render anything until we know if mobile or not
  if (isMobile === null) {
    return null;
  }

  if (isMobile) {
    return <MobileDrawerPlayer />;
  }

  return <DesktopMiniPlayer />;
}
