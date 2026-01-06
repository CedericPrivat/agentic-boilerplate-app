"use client";

import { useEffect } from "react";

import { setTimeZone } from "@/i18n/actions";

type TimezoneProviderProps = {
  timeZone: string;
};

export function TimezoneProvider({ timeZone }: TimezoneProviderProps) {
  useEffect(() => {
    // If server returned the default "UTC", detect and set the user's actual timezone
    if (timeZone === "UTC") {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detectedTimezone !== "UTC") {
        setTimeZone(detectedTimezone);
      }
    }
  }, [timeZone]);

  return null;
}
