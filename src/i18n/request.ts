import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, locales } from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;

  const locale =
    localeCookie && locales.includes(localeCookie as "en" | "de")
      ? localeCookie
      : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
