import {
  bigint,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { fontSourceEnum } from "./certificateElements";

export const font = pgTable("font", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  locale: varchar("locale", { length: 10 }).notNull(), // e.g., "en", "ar", "all"
  source: fontSourceEnum("source").notNull(),
  sourceIdentifier: varchar("source_identifier", { length: 500 }).notNull(), // Google Fonts name or StorageFile ID
  storageFileId: bigint("storage_file_id", { mode: "number" }), // Only used when source is UPLOADED
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
