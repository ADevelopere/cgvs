import { NextRequest, NextResponse } from "next/server";
import { SignedUrlRepository } from "@/server/db/repo";
import logger from "@/server/lib/logger";

/**
 * Cron job endpoint for automated signed URL cleanup
 * POST /api/cron/cleanup-signed-urls
 *
 * This endpoint should be called by a cron service (Vercel Cron, GitHub Actions, etc.)
 * Protected by CRON_SECRET environment variable
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify cron secret for authentication
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      logger.error("CRON_SECRET not configured");
      return NextResponse.json({ error: "Cron endpoint not configured" }, { status: 500 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      logger.warn("Unauthorized cron cleanup attempt", {
        receivedAuth: authHeader ? "present" : "missing",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Step 2: Check if cleanup is enabled via strategy
    const cleanupStrategy = process.env.SIGNED_URL_CLEANUP_STRATEGY || "lazy";

    if (cleanupStrategy !== "cron" && cleanupStrategy !== "both") {
      logger.info("Cron cleanup skipped - strategy not enabled", {
        strategy: cleanupStrategy,
      });
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: "Cron cleanup is not enabled in current strategy",
      });
    }

    // Step 3: Delete expired signed URLs
    const deletedCount = await SignedUrlRepository.deleteExpired();

    // Step 4: Log the cleanup operation
    logger.info("Cron signed URL cleanup completed", {
      deletedCount,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      deletedCount,
      message: `Deleted ${deletedCount} expired signed URLs`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Failed to run cron cleanup for signed URLs", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Health check endpoint
 * GET /api/cron/cleanup-signed-urls
 */
export async function GET() {
  const cleanupStrategy = process.env.SIGNED_URL_CLEANUP_STRATEGY || "lazy";
  const isEnabled = cleanupStrategy === "cron" || cleanupStrategy === "both";

  return NextResponse.json({
    endpoint: "cleanup-signed-urls",
    enabled: isEnabled,
    strategy: cleanupStrategy,
    cronSchedule: process.env.SIGNED_URL_CLEANUP_CRON_SCHEDULE || "0 * * * *",
  });
}
