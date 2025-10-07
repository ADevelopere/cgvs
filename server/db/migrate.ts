/* eslint-disable no-console */
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

/**
 * Run migrations programmatically
 * This is useful for running migrations in production or in CI/CD pipelines
 */
async function runMigrations() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    console.log("Running migrations...");

    await migrate(db, { migrationsFolder: "./server/drizzle" });

    console.log("Migrations completed successfully!");

    await pool.end();
}

runMigrations().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
