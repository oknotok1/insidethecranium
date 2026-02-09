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

interface ThemeToggleProps {
  isMobile?: boolean;
}

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

const ThemeMenuItems = ({
  onSelect,
}: {
  onSelect: (theme: string) => void;
}) => (
  <>
    <DropdownMenuItem onClick={() => onSelect("light")}>
      Light
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => onSelect("dark")}>Dark</DropdownMenuItem>
    <DropdownMenuItem onClick={() => onSelect("system")}>
      System
    </DropdownMenuItem>
  </>
);

export default function ThemeToggle({ isMobile = false }: ThemeToggleProps) {
  const { setTheme } = useTheme();

  const triggerButton = isMobile ? (
    <button className="flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 w-full">
      <ThemeIcon />
      <span>Theme</span>
    </button>
  ) : (
    <Button variant="ghost" size="icon">
      <ThemeIcon size="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );

  const contentProps = isMobile
    ? { align: "start" as const, side: "bottom" as const, sideOffset: 4, alignOffset: 0 }
    : { align: "end" as const };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent {...contentProps}>
        <ThemeMenuItems onSelect={setTheme} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
