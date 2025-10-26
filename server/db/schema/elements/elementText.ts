import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import {
  certificateTextFieldEnum,
  textDataSourceTypeEnum,
  studentTextFieldEnum,
} from "../elements/templateElementEnums";

export const elementText = pgTable("element_text", {
  id: integer("id").primaryKey(), // One-to-one with certificate_element
  textPropsId: integer("text_props_id").notNull(), // References element_text_props
  // source
  textDataSourceType: textDataSourceTypeEnum("text_data_source_type").notNull(),
  staticValue: text("static_value"), // Used when textDataSourceType is STATIC
  templateTextVariableId: integer("template_text_variable_id"), // Used when textDataSourceType is TEMPLATE_TEXT_VARIABLE (type TEXT or SELECT)
  studentTextField: studentTextFieldEnum("student_text_field"), // Used when textDataSourceType is STUDENT_TEXT_FIELD
  certificateTextField: certificateTextFieldEnum("certificate_text_field"), // Used when textDataSourceType is CERTIFICATE_TEXT_FIELD
  // source
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
