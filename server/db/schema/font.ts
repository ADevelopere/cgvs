import { bigint, pgTable, serial, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";

// Font Family table - stores family-level information
export const fontFamily = pgTable("font_family", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(), // e.g., "Cairo", "Roboto"
  category: varchar("category", { length: 50 }), // e.g., "sans-serif", "serif", "display"
  locale: jsonb("locale").$type<string[]>().notNull(), // Array of locale codes: ["en", "ar", "all"]
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Font Variant table - stores individual font files
export const fontVariant = pgTable("font_variant", {
  id: serial("id").primaryKey(),
  familyId: bigint("family_id", { mode: "number" })
    .notNull()
    .references(() => fontFamily.id, { onDelete: "cascade" }),
  variant: varchar("variant", { length: 100 }).notNull(), // e.g., "Regular", "Bold", "Italic"
  storageFileId: bigint("storage_file_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Legacy export for backward compatibility during migration
export const font = fontVariant;
