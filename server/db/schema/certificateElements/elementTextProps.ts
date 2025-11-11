import { integer, pgTable, serial, varchar, check, text } from "drizzle-orm/pg-core";
import { fontSourceEnum, elementOverflowEnum, googleFontFamilyEnum } from "./templateElementEnums";
import { fontVariant } from "../font";
import { sql } from "drizzle-orm";

export const elementTextProps = pgTable(
  "element_text_props",
  {
    id: serial("id").primaryKey(),
    fontSource: fontSourceEnum("font_source").notNull(),
    fontVariantId: integer("font_variant_id").references(() => fontVariant.id, {
      onDelete: "restrict",
    }), // Only populated when fontSource = SELF_HOSTED
    googleFontFamily: googleFontFamilyEnum("google_font_family"), // Only populated when fontSource = GOOGLE
    googleFontVariant: text("google_font_variant"), // Only populated when fontSource = GOOGLE
    fontSize: integer("font_size").notNull(),
    color: varchar("color", { length: 50 }).notNull(), // e.g., "#000000", "rgba(0,0,0,1)"
    overflow: elementOverflowEnum("overflow").notNull(),
  },
  table => [
    // Ensure correct fields are populated based on fontSource
    check(
      "font_source_check",
      sql`(
        (${table.fontSource} = 'SELF_HOSTED' AND ${table.fontVariantId} IS NOT NULL AND ${table.googleFontFamily} IS NULL AND ${table.googleFontVariant} IS NULL)
        OR
        (${table.fontSource} = 'GOOGLE' AND ${table.googleFontFamily} IS NOT NULL AND ${table.googleFontVariant} IS NOT NULL AND ${table.fontVariantId} IS NULL)
      )`
    ),
  ]
);
