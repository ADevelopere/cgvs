import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./drizzle",
    dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
    schema: "./db/schema",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
