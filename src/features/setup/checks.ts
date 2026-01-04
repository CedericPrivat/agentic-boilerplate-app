import type { CheckResult } from "./types";

export async function checkDatabaseConnection(): Promise<CheckResult> {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();

    if (data.checks?.database === "connected") {
      return {
        id: "db-connection",
        name: "PostgreSQL connection",
        status: "success",
        message: "Database connected successfully",
      };
    }

    return {
      id: "db-connection",
      name: "PostgreSQL connection",
      status: "error",
      message: "Database connection failed",
      helpText: "Start Docker services with: bun run dev:services",
    };
  } catch {
    return {
      id: "db-connection",
      name: "PostgreSQL connection",
      status: "error",
      message: "Could not check database status",
      helpText: "Make sure the development server is running",
    };
  }
}

export async function checkEnvVar(
  name: string,
  displayName: string,
  copyTemplate?: string,
  externalLink?: string,
): Promise<CheckResult> {
  // This will be called from server action
  const value = process.env[name];

  if (
    value &&
    value.length > 0 &&
    !value.includes("your-") &&
    !value.includes("xxx")
  ) {
    return {
      id: `env-${name.toLowerCase()}`,
      name: displayName,
      status: "success",
      message: `${displayName} configured`,
    };
  }

  return {
    id: `env-${name.toLowerCase()}`,
    name: displayName,
    status: "error",
    message: `${displayName} not configured`,
    copyValue: copyTemplate,
    externalLink,
  };
}
