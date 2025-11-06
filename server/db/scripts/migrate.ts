import logger from "@/server/lib/logger";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, drizzleDbPool } from "../drizzleDb";

/**
 * Run migrations programmatically
 * This is useful for running migrations in production or in CI/CD pipelines
 */
export async function runMigrations(closePool: boolean) {
  logger.log("Running migrations...");
  logger.warn("⚠️  Pool will be closed after migrations complete");

  await migrate(db, { migrationsFolder: "./server/drizzle" });

  logger.log("Migrations completed successfully!");
  logger.warn("🔴 Closing database pool now...");

  if (!closePool) {
    logger.warn("⚠️  Pool closure skipped as per argument");
    return;
  }

  await drizzleDbPool.end();

  logger.warn("🔴 Database pool has been closed!");
  logger.warn("⚠️  Any subsequent database operations will fail with 'Cannot use a pool after calling end'");
}

if (require.main === module) {
  runMigrations(true).catch(err => {
    logger.error("Migration failed:", err);
    process.exit(1);
  });
}
