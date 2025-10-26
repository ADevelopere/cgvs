import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  calendarTypeEnum,
  dataSourceTypeEnum,
  studentFieldEnum,
} from "../templateElementEnums";

export const elementDate = pgTable("element_date", {
  id: integer("id").primaryKey(), // One-to-one with certificate_element
  textPropsId: integer("text_props_id").notNull(), // References element_text_props
  dataSourceType: dataSourceTypeEnum("data_source_type").notNull(),
  templateVariableId: integer("template_variable_id"), // Used when dataSourceType is TEMPLATE_VARIABLE (type DATE)
  studentField: studentFieldEnum("student_field"), // Used when dataSourceType is STUDENT_FIELD (DATE_OF_BIRTH)
  calendarType: calendarTypeEnum("calendar_type").notNull(),
  offsetDays: integer("offset_days").notNull().default(0),
  format: varchar("format", { length: 100 }).notNull(), // e.g., "YYYY-MM-DD", "DD/MM/YYYY"
  mapping: jsonb("mapping"), // Custom date component mappings (e.g., month names)
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
