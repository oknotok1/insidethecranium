import { Camera, Globe, ListMusic, LucideIcon, Music } from "lucide-react";

export interface NavigationLink {
  href: string;
  label: string;
  icon: LucideIcon;
  mobileOnly?: boolean;
  disabled?: boolean;
  anchorId?: string; // For hash links like /#now-playing
}

export const navigationLinks: NavigationLink[] = [
  { href: "/", label: "Home", icon: Music, mobileOnly: true },
  {
    href: "/#now-playing",
    label: "Now Playing",
    icon: Music,
    anchorId: "now-playing",
  },
  {
    href: "/#featured-songs",
    label: "Featured Songs",
    icon: Music,
    anchorId: "featured-songs",
  },
  { href: "/playlists", label: "Playlists", icon: ListMusic },
  { href: "/concerts", label: "Concerts", icon: Camera },
  { href: "/sites", label: "Sites", icon: Globe },
];

// Helper to get links for specific contexts
export const getNavbarLinks = () =>
  navigationLinks.filter((link) => !link.anchorId);
export const getFooterLinks = () =>
  navigationLinks.filter((link) => !link.mobileOnly);
export const getMobileLinks = () =>
  navigationLinks.filter((link) => !link.anchorId || link.mobileOnly);
