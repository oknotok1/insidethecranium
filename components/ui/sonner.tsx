"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-black/90 dark:group-[.toaster]:text-white dark:group-[.toaster]:border-white/10 backdrop-blur-xl",
          description: "group-[.toast]:text-gray-600 dark:group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-[#3d38f5] group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-gray-200 group-[.toast]:text-gray-900 dark:group-[.toast]:bg-white/10 dark:group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
