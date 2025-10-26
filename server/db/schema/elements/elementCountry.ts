import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";

export const elementCountry = pgTable("element_country", {
  id: integer("id").primaryKey(), // One-to-one with certificate_element
  textPropsId: integer("text_props_id").notNull(), // References element_text_props
  // Data source is implicitly student.nationality
  // The application uses TemplateConfig.locale to map country code to country name
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
