"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, Music, X } from "lucide-react";

import { getNavbarLinks, NavigationLink } from "@/lib/navigation";

import NowPlaying from "@/components/Layout/Navbar/NowPlaying";
import ThemeToggle from "@/components/Theme/ThemeToggle";

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

  const handleLinkClick = () => setIsMenuOpen(false);

  // Derive playlist name from document title when on playlist detail page
  const playlistName = useMemo(() => {
    const isPlaylistDetailPage =
      pathname.startsWith("/playlists/") && pathname !== "/playlists";

    if (isPlaylistDetailPage && typeof document !== "undefined") {
      // Extract playlist name from document title (format: "Playlist Name - Inside The Cranium")
      const title = document.title;
      return title.split(" - ")[0];
    }

    return "";
  }, [pathname]);

  return (
    <>
      <nav
        className={`${styles.navbar} border-gray-200 bg-white/80 dark:border-white/10 dark:bg-black/80`}
      >
        <div className={styles.container}>
          <div className={styles.content}>
            <NavbarLogo handleLinkClick={handleLinkClick} />

            <DesktopLinks
              links={links.filter((link) => !link.mobileOnly)}
              pathname={pathname}
            />

            {/* Mobile-only items */}
            <div className="flex min-w-0 flex-1 items-center justify-end gap-3 lg:hidden">
              <NowPlaying className="max-w-24 min-w-0 shrink md:max-w-40" />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${styles.mobileMenuButton} text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
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

      {/* Backdrop - rendered outside nav for proper click handling */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/20 lg:hidden dark:bg-black/40"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

const NavbarLogo = ({ handleLinkClick }: { handleLinkClick: () => void }) => (
  <Link
    href="/"
    className={`${styles.logo} text-gray-900 hover:text-gray-900 dark:text-gray-100 dark:hover:text-gray-100`}
    onClick={handleLinkClick}
  >
    <Music className="h-6 w-6" />
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
            className={`${styles.navLink} ${styles.disabled} text-gray-600 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-500`}
            aria-disabled="true"
          >
            <Icon className="h-4 w-4" />
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
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      );
    })}

    {/* Now Playing - Desktop */}
    <NowPlaying className="hidden max-w-60 min-w-0 lg:flex" />

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
      className={`${styles.mobileNav} border-gray-200 bg-white/70 dark:border-white/10 dark:bg-black/70`}
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
                className={`${styles.mobileNavLink} ${styles.disabled} bg-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`}
                aria-disabled="true"
              >
                <Icon className="h-5 w-5" />
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
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex min-w-0 items-center gap-2">
                <span className="shrink-0">{label}</span>
                {/* Show playlist name with pipe separator when on detail page */}
                {href === "/playlists" &&
                  isPlaylistDetailPage &&
                  playlistName && (
                    <>
                      <span className="shrink-0 text-gray-400 dark:text-gray-600">
                        |
                      </span>
                      <span className="truncate text-gray-500 dark:text-gray-500">
                        {playlistName}
                      </span>
                    </>
                  )}
              </span>
            </Link>
          );
        })}
        <ThemeToggle isMobile />
      </div>
    </div>
  );
};
