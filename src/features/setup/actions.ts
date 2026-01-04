"use server";

import { db } from "@/db";

import type { CheckGroup, CheckResult } from "./types";

async function checkDatabase(): Promise<CheckResult> {
  try {
    await db.execute("SELECT 1");
    return {
      id: "db-connection",
      name: "PostgreSQL connection",
      status: "success",
      message: "Database connected",
    };
  } catch {
    return {
      id: "db-connection",
      name: "PostgreSQL connection",
      status: "error",
      message: "Connection failed",
      helpText: "Run: bun run dev:services",
    };
  }
}

function checkEnv(
  name: string,
  displayName: string,
  copyTemplate?: string,
  link?: string,
): CheckResult {
  // biome-ignore lint/style/noProcessEnv: Setup checklist must dynamically check arbitrary environment variables
  const value = process.env[name];
  const isConfigured =
    value &&
    value.length > 0 &&
    !value.includes("your-") &&
    !value.includes("xxx");

  return {
    id: `env-${name.toLowerCase()}`,
    name: displayName,
    status: isConfigured ? "success" : "error",
    message: isConfigured ? "Configured" : "Not configured",
    copyValue: isConfigured ? undefined : copyTemplate,
    externalLink: isConfigured ? undefined : link,
  };
}

export async function runAllChecks(): Promise<{
  groups: CheckGroup[];
  lastChecked: string;
}> {
  const dbCheck = await checkDatabase();

  const groups: CheckGroup[] = [
    {
      id: "database",
      icon: "📦",
      title: "Database",
      checks: [dbCheck],
    },
    {
      id: "auth",
      icon: "🔐",
      title: "Authentication",
      checks: [
        checkEnv(
          "BETTER_AUTH_SECRET",
          "Auth Secret",
          "BETTER_AUTH_SECRET=your-secret-min-32-chars",
        ),
        checkEnv(
          "GOOGLE_CLIENT_ID",
          "Google OAuth",
          "GOOGLE_CLIENT_ID=xxx",
          "https://console.cloud.google.com/apis/credentials",
        ),
      ],
    },
    {
      id: "email",
      icon: "📧",
      title: "Email",
      checks: [
        checkEnv(
          "RESEND_API_KEY",
          "Resend API Key",
          "RESEND_API_KEY=re_xxx",
          "https://resend.com/api-keys",
        ),
        checkEnv(
          "EMAIL_FROM",
          "Email From",
          "EMAIL_FROM=noreply@yourdomain.com",
        ),
      ],
    },
    {
      id: "analytics",
      icon: "📈",
      title: "Analytics",
      checks: [
        checkEnv(
          "NEXT_PUBLIC_UMAMI_URL",
          "Umami URL",
          "NEXT_PUBLIC_UMAMI_URL=https://analytics.yourdomain.com",
        ),
        checkEnv(
          "NEXT_PUBLIC_UMAMI_WEBSITE_ID",
          "Umami Website ID",
          "NEXT_PUBLIC_UMAMI_WEBSITE_ID=xxx",
        ),
      ],
    },
    {
      id: "monitoring",
      icon: "🚨",
      title: "Error Monitoring",
      checks: [
        checkEnv(
          "SENTRY_DSN",
          "Sentry DSN",
          "SENTRY_DSN=https://xxx@sentry.io/xxx",
          "https://sentry.io/",
        ),
      ],
    },
  ];

  return {
    groups,
    lastChecked: new Date().toISOString(),
  };
}
