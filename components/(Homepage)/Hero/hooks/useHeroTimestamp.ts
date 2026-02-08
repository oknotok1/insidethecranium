import { useMemo } from "react";

export const useHeroTimestamp = (
  isListening: boolean,
  lastPlayedAt: string | undefined,
) => {
  return useMemo(() => {
    // Always use current time for the bottom timestamp
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = currentDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format last played time for the label
    let lastPlayedTimeForLabel: string | undefined;

    if (!isListening && lastPlayedAt) {
      const lastPlayedDate = new Date(lastPlayedAt);

      const time = lastPlayedDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      // Check if it was today
      const isToday =
        lastPlayedDate.getDate() === currentDate.getDate() &&
        lastPlayedDate.getMonth() === currentDate.getMonth() &&
        lastPlayedDate.getFullYear() === currentDate.getFullYear();

      if (isToday) {
        lastPlayedTimeForLabel = `Last played at ${time} today`;
      } else {
        const date = lastPlayedDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        lastPlayedTimeForLabel = `Last played at ${time} on ${date}`;
      }
    }

    return {
      formattedDate,
      formattedTime,
      lastPlayedTimeForLabel,
    };
  }, [isListening, lastPlayedAt]);
};
