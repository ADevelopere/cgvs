import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const templateConfig = pgTable("template_config", {
  templateId: integer("template_id").primaryKey(), // One-to-one with template
  width: integer("width").notNull(), // Canvas width in pixels
  height: integer("height").notNull(), // Canvas height in pixels
  locale: varchar("locale", { length: 10 }).notNull(), // e.g., "en", "ar"
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
