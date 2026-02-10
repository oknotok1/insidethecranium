import styles from "./styles.module.scss";

const links: {
  [key: string]: {
    href: string;
    icon: string;
    label: string;
  };
} = {
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
  },
};

export function ConnectLinks() {
  return (
    <div className={styles.connectLinks}>
      {Object.entries(links).map(([key, link]) => (
        <a
          key={key}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.connectLink}
        >
          <div
            className={styles.connectLinkIcon}
            style={{
              maskImage: `url(${link.icon})`,
              WebkitMaskImage: `url(${link.icon})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}
