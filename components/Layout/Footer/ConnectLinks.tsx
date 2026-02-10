import { Ear } from "lucide-react";

import styles from "./styles.module.scss";

interface ConnectLink {
  href: string;
  icon: string;
  label: string;
  useComponent?: boolean;
}

const CONNECT_LINKS: Record<string, ConnectLink> = {
  spotify: {
    href: "https://open.spotify.com/user/21h6osgmy2twlu7ichm7ygfhq?si=5c0c7f2a15fa4444",
    icon: "/Images/logos/spotify-color-svgrepo-com.svg",
    label: "Follow on Spotify",
  },
  vsco: {
    href: "https://vsco.co/sappy-shots",
    icon: "/Images/logos/vsco-svgrepo-com.svg",
    label: "View on VSCO",
  },
  lastfm: {
    href: "https://www.last.fm/user/kidk1",
    icon: "/Images/logos/last-fm-svgrepo-com.svg",
    label: "Scrobbles on Last.fm",
  },
  googleforms: {
    href: "https://forms.gle/jpx8t65iQPAU6ucg6",
    icon: "/Images/logos/ear-icon.svg",
    label: "Let's hear it from you!",
    useComponent: true,
  },
};

const HOVER_COLOR = "#8b87ff";

// Helper function for icon mask styles
const getIconMaskStyle = (iconUrl: string) => ({
  maskImage: `url(${iconUrl})`,
  WebkitMaskImage: `url(${iconUrl})`,
  maskSize: "contain",
  WebkitMaskSize: "contain",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
});

export function ConnectLinks() {
  return (
    <div className={styles.connectLinks}>
      {Object.entries(CONNECT_LINKS).map(([key, link]) => (
        <a
          key={key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.connectLink} text-sm text-gray-700 transition-colors hover:text-[#8b87ff] dark:text-gray-300 dark:hover:text-[#8b87ff]`}
        >
          {link.useComponent && key === "googleforms" ? (
            <Ear className={`${styles.connectLinkIcon} transition-colors`} />
          ) : (
            <div
              className={`${styles.connectLinkIcon} transition-colors`}
              style={{
                ...getIconMaskStyle(link.icon),
                backgroundColor: "currentColor",
              }}
            />
          )}
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}
