import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { elementOverflowEnum } from "./templateElementEnums";

export const elementTextProps = pgTable("element_text_props", {
  id: serial("id").primaryKey(),
  fontId: integer("font_id").notNull(),
  fontSize: integer("font_size").notNull(),
  color: varchar("color", { length: 20 }).notNull(), // e.g., "#000000" or "rgba(0,0,0,1)"
  overflow: elementOverflowEnum("overflow").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
