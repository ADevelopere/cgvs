import { integer, pgTable, serial, varchar, check } from "drizzle-orm/pg-core";
import { fontSourceEnum, elementOverflowEnum } from "./templateElementEnums";
import { font } from "../font";
import { sql } from "drizzle-orm";

export const elementTextProps = pgTable(
  "element_text_props",
  {
    id: serial("id").primaryKey(),
    fontSource: fontSourceEnum("font_source").notNull(),
    fontId: integer("font_id").references(() => font.id, {
      onDelete: "restrict",
    }), // Only populated when fontSource = SELF_HOSTED
    googleFontIdentifier: varchar("google_font_identifier", { length: 255 }), // Only populated when fontSource = GOOGLE
    fontSize: integer("font_size").notNull(),
    color: varchar("color", { length: 50 }).notNull(), // e.g., "#000000", "rgba(0,0,0,1)"
    overflow: elementOverflowEnum("overflow").notNull(),
  },
  table => [
    // Ensure correct fields are populated based on fontSource
    check(
      "font_source_check",
      sql`(
        (${table.fontSource} = 'SELF_HOSTED' AND ${table.fontId} IS NOT NULL AND ${table.googleFontIdentifier} IS NULL)
        OR
        (${table.fontSource} = 'GOOGLE' AND ${table.googleFontIdentifier} IS NOT NULL AND ${table.fontId} IS NULL)
      )`
    ),
  ]
);
