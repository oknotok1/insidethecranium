"use client";

import { ArrowUp } from "lucide-react";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 cursor-pointer rounded-full bg-gray-200/80 p-3 text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-[#3d38f5] hover:text-white active:scale-95 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-[#3d38f5] dark:hover:text-white"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
