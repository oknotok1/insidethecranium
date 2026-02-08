"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Music, Menu, X } from "lucide-react";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import NowPlaying from "@/components/(Layout)/Navbar/NowPlaying";
import { getNavbarLinks, NavigationLink } from "@/lib/navigation";
import styles from "./styles.module.scss";

interface DesktopLinksProps {
  links: NavigationLink[];
  pathname: string;
}

interface MobileMenuProps {
  isMenuOpen: boolean;
  links: NavigationLink[];
  pathname: string;
  handleLinkClick: () => void;
  playlistName?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const links = getNavbarLinks();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState<string>("");

  const handleLinkClick = () => setIsMenuOpen(false);

  // Extract playlist name from document title when on playlist detail page
  useEffect(() => {
    const isPlaylistDetailPage =
      pathname.startsWith("/playlists/") && pathname !== "/playlists";
    if (isPlaylistDetailPage) {
      // Extract playlist name from document title (format: "Playlist Name - Inside The Cranium")
      const title = document.title;
      const playlistTitle = title.split(" - ")[0];
      setPlaylistName(playlistTitle || "Playlist");
    } else {
      setPlaylistName("");
    }
  }, [pathname]);

  return (
    <nav
      className={`${styles.navbar} bg-white/80 dark:bg-black/80 border-gray-200 dark:border-white/10`}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <NavbarLogo handleLinkClick={handleLinkClick} />

          <DesktopLinks
            links={links.filter((link) => !link.mobileOnly)}
            pathname={pathname}
          />

          {/* Mobile-only items */}
          <div className="flex items-center justify-end gap-3 lg:hidden flex-1 min-w-0">
            <NowPlaying className="flex-shrink min-w-0 max-w-[6rem] md:max-w-[10rem]" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${styles.mobileMenuButton} text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Direct child of nav */}
      <MobileMenu
        isMenuOpen={isMenuOpen}
        links={links}
        pathname={pathname}
        handleLinkClick={handleLinkClick}
        playlistName={playlistName}
      />
    </nav>
  );
}

const NavbarLogo = ({ handleLinkClick }: { handleLinkClick: () => void }) => (
  <Link
    href="/"
    className={`${styles.logo} text-gray-900 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-100`}
    onClick={handleLinkClick}
  >
    <Music className="w-6 h-6" />
    <span className={styles.logoText}>Inside The Cranium</span>
  </Link>
);

const DesktopLinks = ({ links, pathname }: DesktopLinksProps) => (
  <div className={styles.desktopNav}>
    {links.map(({ href, label, icon: Icon, disabled }) => {
      const isActive = pathname === href;

      if (disabled) {
        return (
          <div
            key={href}
            className={`${styles.navLink} ${styles.disabled} text-gray-600 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-500`}
            aria-disabled="true"
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </div>
        );
      }

      return (
        <Link
          key={href}
          href={href}
          className={`${styles.navLink} ${
            isActive
              ? "text-gray-900 dark:text-white"
              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          }`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </Link>
      );
    })}

    {/* Now Playing - Desktop */}
    <NowPlaying className="hidden lg:flex min-w-0 max-w-[15rem]" />

    <div className="-ml-2">
      <ThemeToggle />
    </div>
  </div>
);

const MobileMenu = ({
  isMenuOpen,
  links,
  pathname,
  handleLinkClick,
  playlistName,
}: MobileMenuProps) => {
  if (!isMenuOpen) return null;

  const isPlaylistDetailPage =
    pathname.startsWith("/playlists/") && pathname !== "/playlists";

  return (
    <div
      className={`${styles.mobileNav} border-gray-200 dark:border-white/10 bg-white/95 dark:bg-black/95`}
    >
      <div className={styles.mobileNavContent}>
        {links.map(({ href, label, icon: Icon, disabled }) => {
          // Highlight Playlists link when on /playlists or /playlists/[id]
          const isActive =
            pathname === href ||
            (href === "/playlists" && pathname.startsWith("/playlists"));

          if (disabled) {
            return (
              <div
                key={href}
                className={`${styles.mobileNavLink} ${styles.disabled} text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-transparent`}
                aria-disabled="true"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </div>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className={`${styles.mobileNavLink} ${
                isActive
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              style={
                isActive
                  ? { backgroundColor: "rgba(61, 56, 245, 0.2)" }
                  : undefined
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex items-center gap-2 min-w-0">
                <span className="shrink-0">{label}</span>
                {/* Show playlist name with pipe separator when on detail page */}
                {href === "/playlists" &&
                  isPlaylistDetailPage &&
                  playlistName && (
                    <>
                      <span className="text-gray-400 dark:text-gray-600 shrink-0">
                        |
                      </span>
                      <span className="text-gray-500 dark:text-gray-500 truncate">
                        {playlistName}
                      </span>
                    </>
                  )}
              </span>
            </Link>
          );
        })}
        <div
          className={`${styles.mobileThemeToggle} text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5`}
        >
          <ThemeToggle />
          <span>Theme</span>
        </div>
      </div>
    </div>
  );
};
