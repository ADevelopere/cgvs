import { integer, pgTable, jsonb } from "drizzle-orm/pg-core";
import { certificateElement } from "./certificateElement";
import { elementTextProps } from "./elementTextProps";
import { templateVariableBases } from "../templateVariables";
import type { NumberDataSource } from "@/server/types/element";

export const numberElement = pgTable("number_element", {
  elementId: integer("element_id")
    .primaryKey()
    .references(() => certificateElement.id, { onDelete: "cascade" }),
  textPropsId: integer("text_props_id")
    .notNull()
    .references(() => elementTextProps.id, { onDelete: "restrict" }),
  mapping: jsonb("mapping").$type<Record<string, string>>(), // Breakpoint-to-text rules
  numberDataSource: jsonb("number_data_source")
    .$type<NumberDataSource>()
    .notNull(),
  // Mirrored from data_source.numberVariableId
  // Always populated (NumberDataSource only has one variant)
  variableId: integer("variable_id")
    .notNull()
    .references(() => templateVariableBases.id, { onDelete: "restrict" }),
});
