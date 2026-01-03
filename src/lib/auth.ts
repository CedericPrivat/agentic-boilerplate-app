import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      // biome-ignore lint/style/noNonNullAssertion: Will be replaced with t3-env in Task 9.1
      // biome-ignore lint/style/noProcessEnv: Will be replaced with t3-env in Task 9.1
      clientId: process.env.GOOGLE_CLIENT_ID!,
      // biome-ignore lint/style/noNonNullAssertion: Will be replaced with t3-env in Task 9.1
      // biome-ignore lint/style/noProcessEnv: Will be replaced with t3-env in Task 9.1
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
