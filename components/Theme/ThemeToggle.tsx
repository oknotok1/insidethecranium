"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEME_OPTIONS = ["light", "dark", "system"] as const;

// Theme icon that switches between sun and moon
const ThemeIcon = ({ size = "h-5 w-5" }: { size?: string }) => (
  <>
    <Sun
      className={`${size} scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90`}
    />
    <Moon
      className={`absolute ${size} scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0`}
    />
  </>
);

// Theme menu items
const ThemeMenuItems = ({
  onSelect,
}: {
  onSelect: (theme: string) => void;
}) => (
  <>
    {THEME_OPTIONS.map((theme) => (
      <DropdownMenuItem key={theme} onClick={() => onSelect(theme)}>
        {theme.charAt(0).toUpperCase() + theme.slice(1)}
      </DropdownMenuItem>
    ))}
  </>
);

export default function ThemeToggle({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {isMobile ? (
          <button className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white">
            <ThemeIcon />
            <span>Theme</span>
          </button>
        ) : (
          <Button variant="ghost" size="icon">
            <ThemeIcon size="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={isMobile ? "start" : "end"}
        {...(isMobile && {
          side: "bottom" as const,
          sideOffset: 4,
          alignOffset: 0,
        })}
      >
        <ThemeMenuItems onSelect={setTheme} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
