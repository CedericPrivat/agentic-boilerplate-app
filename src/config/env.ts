// biome-ignore-all lint/style/noProcessEnv: This file is the only place where process.env access is allowed (t3-env)
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_BETTER_AUTH_URL: z
      .url()
      .optional()
      .default("http://localhost:3000"),
    NEXT_PUBLIC_UMAMI_URL: z.url().optional(),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
  },
  emptyStringAsUndefined: true,
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    CI: process.env.CI,
    DATABASE_URL: process.env.DATABASE_URL,
    EMAIL_DEV_PORT: process.env.EMAIL_DEV_PORT,
    EMAIL_FROM: process.env.EMAIL_FROM,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    UPTIME_KUMA_URL: process.env.UPTIME_KUMA_URL,
  },
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    CI: z.coerce.boolean().optional().default(false),
    DATABASE_URL: z.url(),
    EMAIL_DEV_PORT: z.coerce.number().optional().default(3002),
    EMAIL_FROM: z.email().optional().default("noreply@example.com"),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_DSN: z.url().optional(),
    UPTIME_KUMA_URL: z.url().optional(),
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
