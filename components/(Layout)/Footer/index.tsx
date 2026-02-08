import Link from "next/link";
import { Music2 } from "lucide-react";
import { getFooterLinks } from "@/lib/navigation";
import styles from "./styles.module.scss";

export default function Footer() {
  const quickLinks = getFooterLinks();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <BrandSection />
          <QuickLinksSection links={quickLinks} />
          <ConnectSection />
          <CopyrightSection />
        </div>
      </div>
    </footer>
  );
}

const BrandSection = () => (
  <div className={styles.brandSection}>
    <div className={styles.brandHeader}>
      <Music2 className={styles.brandIcon} />
      <span className={styles.brandTitle}>My Music Showcase</span>
    </div>
    <p className={styles.brandDescription}>
      Sharing my musical journey through songs, playlists, and concert memories.
    </p>
  </div>
);

const QuickLinksSection = ({ links }: { links: ReturnType<typeof getFooterLinks> }) => (
  <div className={styles.section}>
    <h3 className={styles.sectionTitle}>Quick Links</h3>
    <nav className={styles.nav}>
      {links.map((link) => {
        if (link.disabled) {
          return (
            <span
              key={link.href}
              className={`${styles.navLink} ${styles.disabled}`}
              aria-disabled="true"
            >
              {link.label}
            </span>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={styles.navLink}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  </div>
);

const ConnectSection = () => (
  <div className={styles.section}>
    <h3 className={styles.sectionTitle}>Connect</h3>
    <a
      href="https://open.spotify.com"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.connectLink}
    >
      <svg
        className={styles.spotifyIcon}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
      <span>Follow me on Spotify</span>
    </a>
  </div>

);

const CopyrightSection = () => (
  <div className={styles.copyright}>
    <p>
      &copy; {new Date().getFullYear()} Inside The Cranium. All rights reserved.
    </p>
  </div>
);
