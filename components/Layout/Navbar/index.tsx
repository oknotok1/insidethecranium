"use client";

import { Menu, Music, X } from "lucide-react";

import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import NowPlaying from "@/components/Layout/Navbar/NowPlaying";
import ThemeToggle from "@/components/Theme/ThemeToggle";

import { getNavbarLinks, type NavigationLink } from "@/lib/navigation";

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

// Helper to check if a link is active
const isLinkActive = (pathname: string, href: string): boolean => {
  if (href === "/playlists") {
    return pathname.startsWith("/playlists");
  }
  return pathname === href;
};

// Helper to extract playlist name from document title
const extractPlaylistName = (): string => {
  const title = document.title;
  return title.split(" - ")[0];
};

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
      setPlaylistName(extractPlaylistName());
    } else {
      setPlaylistName("");
    }
  }, [pathname]);

  return (
    <>
      <nav
        className={`${styles.navbar} border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-white/10 dark:bg-black/80`}
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
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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

      {/* Backdrop */}
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
      const isActive = isLinkActive(pathname, href);

      return disabled ? (
        <div
          key={href}
          className={`${styles.navLink} cursor-not-allowed text-gray-600 opacity-40 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-500`}
          aria-disabled="true"
          style={{ pointerEvents: "auto" }}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </div>
      ) : (
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
  const isPlaylistDetailPage =
    pathname.startsWith("/playlists/") && pathname !== "/playlists";

  if (!isMenuOpen) return null;

  return (
    <div
      className={`${styles.mobileNav} border-t border-gray-200 bg-white/70 backdrop-blur-sm dark:border-white/10 dark:bg-black/70`}
    >
      <div className={styles.mobileNavContent}>
        {links.map(({ href, label, icon: Icon, disabled }) => {
          const isActive = isLinkActive(pathname, href);

          return disabled ? (
            <div
              key={href}
              className={`${styles.mobileNavLink} cursor-not-allowed bg-transparent text-gray-600 opacity-40 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white`}
              aria-disabled="true"
              style={{ pointerEvents: "auto" }}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </div>
          ) : (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className={`${styles.mobileNavLink} ${
                isActive
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
              style={isActive ? { backgroundColor: "rgba(61, 56, 245, 0.2)" } : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex min-w-0 items-center gap-2">
                <span className="shrink-0">{label}</span>
                {href === "/playlists" && isPlaylistDetailPage && playlistName && (
                  <>
                    <span className="shrink-0 text-gray-400 dark:text-gray-600">|</span>
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
