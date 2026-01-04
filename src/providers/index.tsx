"use client";

import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ToasterProvider } from "./toaster-provider";

type ProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

export function Providers({ children, locale, messages }: ProvidersProps) {
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
          <ToasterProvider />
        </QueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
