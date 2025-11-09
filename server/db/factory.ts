import { Pool } from "pg";
import { drizzle as drizzlePostgres } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { relations } from "./drizzleRelations";
import logger from "@/server/lib/logger";

export type DatabaseProvider = "postgres" | "neon";

export function createDatabase() {
  const provider = (process.env.DB_PROVIDER || "postgres") as DatabaseProvider;
  
  if (!process.env.DATABASE_URL) {
    logger.error("DATABASE_URL is not set in environment variables");
    process.exit(1);
  }

  logger.log(`Creating database connection with provider: ${provider}`);

  switch (provider) {
    case "neon": {
      logger.log("Initializing Neon serverless connection");
      const sql = neon(process.env.DATABASE_URL);
      return drizzleNeon(sql, { relations });
    }
    case "postgres":
    default: {
      logger.log("Initializing PostgreSQL connection pool");
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
      });
      return drizzlePostgres(pool, { relations });
    }
  }
}

export function createPool() {
  const provider = (process.env.DB_PROVIDER || "postgres") as DatabaseProvider;
  
  if (provider === "neon") {
    throw new Error("Pool creation not supported for Neon provider");
  }
  
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  });
}