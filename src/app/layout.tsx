import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getLocale, getMessages, getTimeZone } from "next-intl/server";
import type { ReactNode } from "react";

import { Providers } from "@/providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  description: "Production-ready Next.js 16 boilerplate with CLI scaffolding",
  title: "Agentic Boilerplate",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
  const timeZone = await getTimeZone();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <Providers locale={locale} messages={messages} timeZone={timeZone}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
