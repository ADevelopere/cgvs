import { bigint, integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { elementImageFitEnum } from "./templateElementEnums";

export const elementImage = pgTable("element_image", {
  id: integer("id").primaryKey(), // One-to-one with certificate_element
  storageFileId: bigint("storage_file_id", { mode: "number" }).notNull(),
  fit: elementImageFitEnum("fit").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
