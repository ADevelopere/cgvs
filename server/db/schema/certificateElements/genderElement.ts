import { integer, pgTable } from "drizzle-orm/pg-core";
import { certificateElement } from "./certificateElement";
import { elementTextProps } from "./elementTextProps";

export const genderElement = pgTable("gender_element", {
  elementId: integer("element_id")
    .primaryKey()
    .references(() => certificateElement.id, { onDelete: "cascade" }),
  textPropsId: integer("text_props_id")
    .notNull()
    .references(() => elementTextProps.id, { onDelete: "restrict" }),
});

