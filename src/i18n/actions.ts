"use server";

import { cookies } from "next/headers";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function setTimeZone(timeZone: string) {
  const cookieStore = await cookies();
  cookieStore.set("timeZone", timeZone, {
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}
