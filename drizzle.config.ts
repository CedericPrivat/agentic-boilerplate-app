import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: Will be replaced with t3-env in Task 9.1
    // biome-ignore lint/style/noProcessEnv: Will be replaced with t3-env in Task 9.1
    url: process.env.DATABASE_URL!,
  },
});
