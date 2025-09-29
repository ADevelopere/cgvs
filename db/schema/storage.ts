import {
    pgTable,
    bigint,
    text,
    boolean,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core";

export const storageFiles = pgTable("StorageFile", {
    id: bigint("id", { mode: "bigint" }).primaryKey(),
    path: text("path").notNull().unique(),
    isProtected: boolean("isProtected").notNull().default(false),
});

export const fileUsages = pgTable("FileUsage", {
    id: bigint("id", { mode: "bigint" }).primaryKey(),
    filePath: varchar("filePath", { length: 1024 }).notNull(),
    usageType: varchar("usageType", { length: 100 }).notNull(),
    referenceId: bigint("referenceId", { mode: "bigint" }).notNull(),
    referenceTable: varchar("referenceTable", { length: 100 }).notNull(),
    created: timestamp("created", { precision: 3 }).notNull(),
});

export const storageDirectories = pgTable("StorageDirectory", {
    id: bigint("id", { mode: "bigint" }).primaryKey(),
    path: varchar("path", { length: 1024 }).notNull().unique(),
    allowUploads: boolean("allowUploads").notNull().default(true),
    allowDelete: boolean("allowDelete").notNull().default(true),
    allowMove: boolean("allowMove").notNull().default(true),
    allowCreateSubDirs: boolean("allowCreateSubDirs").notNull().default(true),
    allowDeleteFiles: boolean("allowDeleteFiles").notNull().default(true),
    allowMoveFiles: boolean("allowMoveFiles").notNull().default(true),
    isProtected: boolean("isProtected").notNull().default(false),
    protectChildren: boolean("protectChildren").notNull().default(false),
});
