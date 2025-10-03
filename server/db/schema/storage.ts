import {
    pgTable,
    bigint,
    text,
    boolean,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core";

export const storageFiles = pgTable("storage_file", {
    id: bigint("id", { mode: "bigint" }).primaryKey(),
    path: text("path").notNull().unique(),
    isProtected: boolean("is_protected").notNull().default(false),
});

export const fileUsages = pgTable("file_usage", {
    id: bigint("id", { mode: "bigint" }).primaryKey(),
    filePath: varchar("file_path", { length: 1024 }).notNull(),
    usageType: varchar("usage_type", { length: 100 }).notNull(),
    referenceId: bigint("reference_id", { mode: "bigint" }).notNull(),
    referenceTable: varchar("reference_table", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
});

export const storageDirectories = pgTable("storage_directory", {
    id: bigint("id", { mode: "bigint" }).primaryKey(),
    path: varchar("path", { length: 1024 }).notNull().unique(),
    allowUploads: boolean("allow_uploads").notNull().default(true),
    allowDelete: boolean("allow_delete").notNull().default(true),
    allowMove: boolean("allow_move").notNull().default(true),
    allowCreateSubDirs: boolean("allow_create_sub_dirs")
        .notNull()
        .default(true),
    allowDeleteFiles: boolean("allow_delete_files").notNull().default(true),
    allowMoveFiles: boolean("allow_move_files").notNull().default(true),
    isProtected: boolean("is_protected").notNull().default(false),
    protectChildren: boolean("protect_children").notNull().default(false),
});
