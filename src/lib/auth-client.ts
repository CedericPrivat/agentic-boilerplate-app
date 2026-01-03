import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // biome-ignore lint/style/noProcessEnv: Will be replaced with t3-env in Task 9.1
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
});

export const { signIn, signOut, signUp, useSession } = authClient;
