import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  // biome-ignore lint/style/noNonNullAssertion: Will be replaced with t3-env in Task 9.1
  // biome-ignore lint/style/noProcessEnv: Will be replaced with t3-env in Task 9.1
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool);
