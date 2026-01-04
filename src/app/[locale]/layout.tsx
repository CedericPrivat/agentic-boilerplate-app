import { notFound } from "next/navigation";

import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { routing } from "@/i18n/routing";
import { Providers } from "@/providers";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "de")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <Providers locale={locale} messages={messages}>
      {children}
    </Providers>
  );
}
