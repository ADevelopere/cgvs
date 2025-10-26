import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";

export const elementGender = pgTable("element_gender", {
  id: integer("id").primaryKey(), // One-to-one with certificate_element
  textPropsId: integer("text_props_id").notNull(), // References element_text_props
  // Data source is implicitly student.gender
  // The application uses TemplateConfig.locale for mapping gender to text
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
