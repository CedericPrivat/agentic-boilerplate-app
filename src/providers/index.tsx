"use client";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { TimezoneProvider } from "./timezone-provider";
import { ToasterProvider } from "./toaster-provider";

type ProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  timeZone: string;
};

export function Providers({
  children,
  locale,
  messages,
  timeZone,
}: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>
          {children}
          <TimezoneProvider timeZone={timeZone} />
          <ToasterProvider />
        </QueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
