"use server";

import { db } from "@/db";

import type { CheckGroup, CheckResult } from "./types";

async function checkDatabase(): Promise<CheckResult> {
  try {
    await db.execute("SELECT 1");
    return {
      id: "db-connection",
      message: "Database connected",
      name: "PostgreSQL connection",
      status: "success",
    };
  } catch {
    return {
      helpText: "Run: bun run dev:services",
      id: "db-connection",
      message: "Connection failed",
      name: "PostgreSQL connection",
      status: "error",
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
    copyValue: isConfigured ? undefined : copyTemplate,
    externalLink: isConfigured ? undefined : link,
    id: `env-${name.toLowerCase()}`,
    message: isConfigured ? "Configured" : "Not configured",
    name: displayName,
    status: isConfigured ? "success" : "error",
  };
}

export async function runAllChecks(): Promise<{
  groups: CheckGroup[];
  lastChecked: string;
}> {
  const dbCheck = await checkDatabase();

  const groups: CheckGroup[] = [
    {
      checks: [dbCheck],
      icon: "📦",
      id: "database",
      title: "Database",
    },
    {
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
      icon: "🔐",
      id: "auth",
      title: "Authentication",
    },
    {
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
      icon: "📧",
      id: "email",
      title: "Email",
    },
    {
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
      icon: "📈",
      id: "analytics",
      title: "Analytics",
    },
    {
      checks: [
        checkEnv(
          "SENTRY_DSN",
          "Sentry DSN",
          "SENTRY_DSN=https://xxx@sentry.io/xxx",
          "https://sentry.io/",
        ),
      ],
      icon: "🚨",
      id: "monitoring",
      title: "Error Monitoring",
    },
  ];

  return {
    groups,
    lastChecked: new Date().toISOString(),
  };
}
