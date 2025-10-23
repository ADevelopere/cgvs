import { Pool } from "pg";
import logger from "@/server/lib/logger";
import { runMigrations } from "./migrate";

function parseDatabaseUrl(url: string) {
  // Example: postgres://user:password@host:port/dbname or postgresql://user:password@host:port/dbname
  const match = url.match(
    /^postgres(?:ql)?:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)$/
  );
  if (!match) throw new Error("Invalid DATABASE_URL format");
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    database: match[5],
  };
}

async function resetDatabase() {
  if (!process.env.DATABASE_URL) {
    logger.error("DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;
  logger.debug(`Resetting database: ${dbUrl}`);

  const { user, password, host, port, database } = parseDatabaseUrl(dbUrl);
  logger.log(`Resetting database: ${database}`);

  // Connect to 'postgres' DB to drop/create target DB
  const adminPool = new Pool({
    user,
    password,
    host,
    port: Number(port),
    database: "postgres",
  });
  try {
    // Terminate connections to target DB
    await adminPool.query(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1;`,
      [database]
    );
    // Drop DB
    await adminPool.query(`DROP DATABASE IF EXISTS "${database}";`);
    logger.log(`Dropped database: ${database}`);
    // Create DB
    await adminPool.query(`CREATE DATABASE "${database}";`);
    logger.log(`Created database: ${database}`);
  } catch (err) {
    logger.error("Error resetting database:", err);
    await adminPool.end();
    process.exit(1);
  }
  await adminPool.end();

  // Run migrations
  try {
    await runMigrations(true);
    logger.log("Migration after reset completed successfully!");
  } catch (err) {
    logger.error("Migration after reset failed:", err);
    process.exit(1);
  }
}

resetDatabase().catch(err => {
  logger.error("Reset DB failed:", err);
  process.exit(1);
});
