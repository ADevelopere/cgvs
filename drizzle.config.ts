import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./server/drizzle",
    dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
    schema: "./server/db/schema",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
