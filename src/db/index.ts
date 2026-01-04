import { drizzle } from "drizzle-orm/bun-sql";

import { env } from "@/config/env";

import * as authSchema from "./schema/auth";

export const db = drizzle(env.DATABASE_URL, { schema: { ...authSchema } });
