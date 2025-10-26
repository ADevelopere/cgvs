import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import {
  certificateFieldEnum,
  dataSourceTypeEnum,
  studentFieldEnum,
} from "../templateElementEnums";

export const elementText = pgTable("element_text", {
  id: integer("id").primaryKey(), // One-to-one with certificate_element
  textPropsId: integer("text_props_id").notNull(), // References element_text_props
  dataSourceType: dataSourceTypeEnum("data_source_type").notNull(),
  staticValue: text("static_value"), // Used when dataSourceType is STATIC
  templateVariableId: integer("template_variable_id"), // Used when dataSourceType is TEMPLATE_VARIABLE (type TEXT or SELECT)
  studentField: studentFieldEnum("student_field"), // Used when dataSourceType is STUDENT_FIELD
  certificateField: certificateFieldEnum("certificate_field"), // Used when dataSourceType is CERTIFICATE_FIELD
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
