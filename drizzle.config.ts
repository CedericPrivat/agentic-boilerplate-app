import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    // biome-ignore lint/style/noNonNullAssertion: Will be replaced with t3-env in Task 9.1
    // biome-ignore lint/style/noProcessEnv: Will be replaced with t3-env in Task 9.1
    url: process.env.DATABASE_URL!,
  },
  dialect: "postgresql",
  out: "./src/db/migrations",
  schema: "./src/db/schema",
});
