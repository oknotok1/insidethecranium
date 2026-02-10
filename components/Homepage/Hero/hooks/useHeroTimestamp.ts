import { useMemo } from "react";

const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) =>
  date.toLocaleDateString("en-US", options);

const formatTime = (date: Date, options: Intl.DateTimeFormatOptions) =>
  date.toLocaleTimeString("en-US", options);

const isSameDay = (date1: Date, date2: Date) =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();

export const useHeroTimestamp = (
  isListening: boolean,
  lastPlayedAt: string | undefined,
) => {
  return useMemo(() => {
    const currentDate = new Date();

    const formattedDate = formatDate(currentDate, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = formatTime(currentDate, {
      hour: "2-digit",
      minute: "2-digit",
    });

    let lastPlayedTimeForLabel: string | undefined;

    if (!isListening && lastPlayedAt) {
      const lastPlayedDate = new Date(lastPlayedAt);
      const time = formatTime(lastPlayedDate, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      if (isSameDay(lastPlayedDate, currentDate)) {
        lastPlayedTimeForLabel = `Last played at ${time} today`;
      } else {
        const date = formatDate(lastPlayedDate, {
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
