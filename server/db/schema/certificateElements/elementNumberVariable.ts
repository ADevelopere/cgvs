import { integer, jsonb, pgTable, timestamp } from "drizzle-orm/pg-core";

export const elementNumberVariable = pgTable("element_number_variable", {
  id: integer("id").primaryKey(), // One-to-one with certificate_element
  textPropsId: integer("text_props_id").notNull(), // References element_text_props
  templateVariableId: integer("template_variable_id").notNull(), // References template_variable_base (type NUMBER)
  mapping: jsonb("mapping").notNull(), // Stores breakpoint-to-text rules
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
