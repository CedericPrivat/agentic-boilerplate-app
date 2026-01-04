import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";

export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      checks: {
        api: "responsive",
        database: "connected",
      },
      responseTime: `${responseTime}ms`,
      status: "healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        checks: {
          api: "responsive",
          database: "disconnected",
        },
        error: error instanceof Error ? error.message : "Unknown error",
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
