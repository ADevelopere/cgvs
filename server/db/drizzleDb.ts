import logger from "@/server/lib/logger";

// Verify DATABASE_URL is loaded
if (!process.env.DATABASE_URL) {
  logger.error("server/db/drizzleDb.ts:❌ Error: DATABASE_URL is not set in environment variables");
  logger.error("   Please check your .env file");
  process.exit(1);
} else {
  logger.log("server/db/drizzleDb.ts Environment variables loaded successfully");
  logger.log(`   DATABASE_URL=${process.env.DATABASE_URL?.substring(0, 20)}...`);
}

import { relations } from "./drizzleRelations";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
// import { DefaultLogger, type LogWriter } from "drizzle-orm/logger";

export const drizzleDbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  // other pool options...
});

export const drizzleLogs: string[] = [];

export function clearDrizzleLogs() {
  drizzleLogs.length = 0;
}

// class MyLogWriter implements LogWriter {
//     write(message: string) {
//         if (!process.env.VITEST) {
//             console.log(message);
//         } else {
//             drizzleLogs.push(message);
//         }
//     }
// }

// const logger = new DefaultLogger({ writer: new MyLogWriter() });
export const db = drizzle(drizzleDbPool, {
  relations,
  // logger
});

export { relations };

export type DrizzleRelations = typeof relations;
