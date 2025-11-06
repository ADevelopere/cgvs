import { integer, pgTable, jsonb, varchar } from "drizzle-orm/pg-core";
import { certificateElement } from "./certificateElement";
import { elementTextProps } from "./elementTextProps";
import { templateVariableBases } from "../templateVariables";
import { calendarTypeEnum, dateTransformationTypeEnum } from "./templateElementEnums";
import { type DateDataSource } from "@/server/types/element";

export const dateElement = pgTable("date_element", {
  elementId: integer("element_id")
    .primaryKey()
    .references(() => certificateElement.id, { onDelete: "cascade" }),
  textPropsId: integer("text_props_id")
    .notNull()
    .references(() => elementTextProps.id, { onDelete: "restrict" }),
  calendarType: calendarTypeEnum("calendar_type").notNull(),
  offsetDays: integer("offset_days").notNull().default(0),
  format: varchar("format", { length: 100 }).notNull(), // e.g., "YYYY-MM-DD", "DD/MM/YYYY"
  transformation: dateTransformationTypeEnum("transformation"), // AGE_CALCULATION
  dateDataSource: jsonb("date_data_source").$type<DateDataSource>().notNull(),
  // Mirrored from data_source.dateVariableId
  // Populated when data_source.type = 'TEMPLATE_DATE_VARIABLE'
  variableId: integer("variable_id").references(() => templateVariableBases.id, { onDelete: "restrict" }),
});
