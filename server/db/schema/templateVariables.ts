import {
    pgTable,
    integer,
    varchar,
    text,
    boolean,
    timestamp,
    decimal,
    json,
    uniqueIndex,
    serial,
} from "drizzle-orm/pg-core";
import { TemplateVariableType } from "@/server/types/templateVariable.types";
import { createPgEnumFromEnum } from "../../utils/db.utils";

export const templateVariableTypeEnum = createPgEnumFromEnum(
    "template_variable_type",
    TemplateVariableType,
);

export const templateVariableBases = pgTable(
    "template_variable_base",
    {
        id: serial("id").primaryKey(),
        templateId: integer("template_id").notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        type: templateVariableTypeEnum("type").notNull(),
        required: boolean("required").notNull().default(false),
        order: integer("order").notNull(),
        previewValue: varchar("preview_value", { length: 255 }),
        createdAt: timestamp("created_at", { precision: 3 }).notNull(),
        updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("template_base_variable_template_id_name_key").on(
            table.templateId,
            table.name,
        ),
    ],
);

export const templateTextVariables = pgTable("template_text_variable", {
    id: integer("id").primaryKey(),
    minLength: integer("min_length"),
    maxLength: integer("max_length"),
    pattern: varchar("pattern", { length: 255 }),
});

export const templateNumberVariables = pgTable("template_number_variable", {
    id: integer("id").primaryKey(),
    minValue: decimal("min_value", { mode: "number" }),
    maxValue: decimal("max_value", { mode: "number" }),
    decimalPlaces: integer("decimal_places"),
});

export const templateDateVariables = pgTable("template_date_variable", {
    id: integer("id").primaryKey(),
    minDate: timestamp("min_date", { precision: 3 }),
    maxDate: timestamp("max_date", { precision: 3 }),
    format: varchar("format", { length: 50 }),
});

export const templateSelectVariables = pgTable("template_select_variable", {
    id: integer("id").primaryKey(),
    options: json("options"),
    multiple: boolean("multiple"),
});
