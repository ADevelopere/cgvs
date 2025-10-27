import {
  bigint,
  pgTable,
  serial,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

export const font = pgTable("font", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  locale: jsonb("locale").$type<string[]>().notNull(), // Array of locale codes: ["en", "ar", "all"]
  storageFileId: bigint("storage_file_id", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
