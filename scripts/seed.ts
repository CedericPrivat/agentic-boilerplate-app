import { sql } from "drizzle-orm";

import { db } from "@/db";

async function seed() {
  console.log("Seeding database...");

  // Verify database connection
  await db.execute(sql`SELECT 1`);
  console.log("Connected to database");

  // Add seed data here
  // Example: await db.insert(users).values({ ... })

  console.log("Seeding complete!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
