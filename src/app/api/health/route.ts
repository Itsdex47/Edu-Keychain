import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Test database connection
    const studentCount = await db.student.count();

    return NextResponse.json({
      message: "Good!",
      database: "Connected",
      studentCount,
      environment: process.env.NODE_ENV,
      hasPostgresUrl: !!process.env.POSTGRES_PRISMA_URL,
      hasDirectUrl: !!process.env.POSTGRES_URL_NON_POOLING
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      message: "Database connection failed",
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      hasPostgresUrl: !!process.env.POSTGRES_PRISMA_URL,
      hasDirectUrl: !!process.env.POSTGRES_URL_NON_POOLING
    }, { status: 500 });
  }
}