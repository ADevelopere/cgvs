import { integer, pgTable, timestamp, serial } from "drizzle-orm/pg-core";
import { appLanguageEnum } from "./enums";
import { templates } from "./templates";

export const templateConfig = pgTable("template_config", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id")
    .notNull()
    .references(() => templates.id)
    .unique(),
  width: integer("width").notNull(), // Canvas width in pixels
  height: integer("height").notNull(), // Canvas height in pixels
  language: appLanguageEnum("language").notNull(), // e.g., "en", "ar"
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
