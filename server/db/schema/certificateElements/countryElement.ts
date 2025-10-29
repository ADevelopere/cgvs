import { integer, pgTable } from "drizzle-orm/pg-core";
import { certificateElement } from "./certificateElement";
import { elementTextProps } from "./elementTextProps";
import { countryRepresentationEnum } from "./templateElementEnums";

export const countryElement = pgTable("country_element", {
  elementId: integer("element_id")
    .primaryKey()
    .references(() => certificateElement.id, { onDelete: "cascade" }),
  textPropsId: integer("text_props_id")
    .notNull()
    .references(() => elementTextProps.id, { onDelete: "restrict" }),
  representation: countryRepresentationEnum("representation").notNull(), // COUNTRY_NAME | NATIONALITY
});

