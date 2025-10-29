import { integer, pgTable, jsonb } from "drizzle-orm/pg-core";
import { certificateElement } from "./certificateElement";
import { elementTextProps } from "./elementTextProps";
import { templateVariableBases } from "../templateVariables";
import type { TextDataSource } from "@/server/types/element";

export const textElement = pgTable("text_element", {
  elementId: integer("element_id")
    .primaryKey()
    .references(() => certificateElement.id, { onDelete: "cascade" }),
  textPropsId: integer("text_props_id")
    .notNull()
    .references(() => elementTextProps.id, { onDelete: "restrict" }),
  textDataSource: jsonb("text_data_source").$type<TextDataSource>().notNull(),
  // Mirrored from data_source.textVariableId OR data_source.selectVariableId
  // Populated when data_source.type IN ('TEMPLATE_TEXT_VARIABLE', 'TEMPLATE_SELECT_VARIABLE')
  // Repository layer maps this to correct TypeScript field name based on data_source.type
  variableId: integer("variable_id").references(
    () => templateVariableBases.id,
    { onDelete: "restrict" }
  ),
});
