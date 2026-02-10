import { Music2 } from "lucide-react";

import Link from "next/link";

import { getFooterLinks, type NavigationLink } from "@/lib/navigation";

import { ConnectLinks } from "./ConnectLinks";
import styles from "./styles.module.scss";

const BRAND_ICON_COLOR = "#3d38f5";
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const quickLinks = getFooterLinks();

  return (
    <footer
      className={`${styles.footer} border-t border-gray-200 bg-gray-50 backdrop-blur-sm dark:border-white/10 dark:bg-black/50`}
    >
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
      <Music2
        className={styles.brandIcon}
        style={{ color: BRAND_ICON_COLOR }}
      />
      <span
        className={`${styles.brandTitle} text-lg font-semibold text-gray-900 dark:text-white`}
      >
        My Music Showcase
      </span>
    </div>
    <p
      className={`${styles.brandDescription} text-sm text-gray-600 dark:text-gray-400`}
    >
      Sharing my musical journey through songs, playlists, and concert memories.
    </p>
  </div>
);

const QuickLinksSection = ({ links }: { links: NavigationLink[] }) => (
  <div className={styles.section}>
    <h3
      className={`${styles.sectionTitle} text-sm font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400`}
    >
      Quick Links
    </h3>
    <nav className={styles.nav}>
      {links.map((link) =>
        link.disabled ? (
          <span
            key={link.href}
            className={`${styles.navLink} cursor-not-allowed text-sm text-gray-700 opacity-40 dark:text-gray-300`}
            aria-disabled="true"
            style={{ pointerEvents: "auto" }}
          >
            {link.label}
          </span>
        ) : (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} text-sm text-gray-700 transition-colors hover:text-[#8b87ff] dark:text-gray-300 dark:hover:text-[#8b87ff]`}
          >
            {link.label}
          </Link>
        ),
      )}
    </nav>
  </div>
);

const ConnectSection = () => (
  <div className={styles.section}>
    <h3
      className={`${styles.sectionTitle} text-sm font-semibold tracking-wider text-gray-600 uppercase dark:text-gray-400`}
    >
      Connect
    </h3>
    <ConnectLinks />
  </div>
);

const CopyrightSection = () => (
  <div
    className={`${styles.copyright} border-t border-gray-200 text-center text-sm text-gray-500 dark:border-white/10 dark:text-gray-400`}
  >
    <p>&copy; {CURRENT_YEAR} Inside The Cranium. All rights reserved.</p>
  </div>
);
