import Link from "next/link";
import { Music2 } from "lucide-react";
import { getFooterLinks } from "@/lib/navigation";
import { ConnectLinks } from "./ConnectLinks";
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

const QuickLinksSection = ({
  links,
}: {
  links: ReturnType<typeof getFooterLinks>;
}) => (
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
          <Link key={link.href} href={link.href} className={styles.navLink}>
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
    <ConnectLinks />
  </div>
);

const CopyrightSection = () => (
  <div className={styles.copyright}>
    <p>
      &copy; {new Date().getFullYear()} Inside The Cranium. All rights reserved.
    </p>
  </div>
);
