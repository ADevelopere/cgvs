import logger from "@/lib/logger";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, drizzleDbPool } from "../drizzleDb";

/**
 * Run migrations programmatically
 * This is useful for running migrations in production or in CI/CD pipelines
 */
export async function runMigrations() {
  logger.log("Running migrations...");

  await migrate(db, { migrationsFolder: "./server/drizzle" });

  logger.log("Migrations completed successfully!");

  await drizzleDbPool.end();
}

if (require.main === module) {
  runMigrations().catch(err => {
    logger.error("Migration failed:", err);
    process.exit(1);
  });
}
