/* eslint-disable no-console */
import { DefaultLogger, type LogWriter } from "drizzle-orm/logger";
import { relations } from "./relations";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    // other pool options...
});

export const drizzleLogs: string[] = [];

export function clearDrizzleLogs() {
    drizzleLogs.length = 0;
}

class MyLogWriter implements LogWriter {
    write(message: string) {
        if (!process.env.VITEST) {
            console.log(message);
        } else {
            drizzleLogs.push(message);
        }
    }
}

const logger = new DefaultLogger({ writer: new MyLogWriter() });
export const db = drizzle(pool, { relations, logger });

export { relations };

export type DrizzleRelations = typeof relations;
