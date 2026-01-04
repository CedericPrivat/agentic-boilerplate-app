"use client";

import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("setup");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="mt-4 text-muted-foreground">{t("description")}</p>
    </main>
  );
}
