import {
    pgTable,
    serial,
    integer,
    varchar,
    text,
    boolean,
    timestamp,
    decimal,
    json,
    pgEnum,
    uniqueIndex,
} from "drizzle-orm/pg-core";

export const templateVariableTypeEnum = pgEnum("template_variable_type", [
    "TEXT",
    "NUMBER",
    "DATE",
    "SELECT",
]);

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
        createdAt: timestamp("created_at", { precision: 3 }).notNull(),
        updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("template_variable_base_template_id_name_key").on(
            table.templateId,
            table.name,
        ),
    ],
);

export const templateTextVariables = pgTable("text_template_variable", {
    id: integer("id").primaryKey(),
    minLength: integer("min_length"),
    maxLength: integer("max_length"),
    pattern: varchar("pattern", { length: 255 }),
    previewValue: varchar("preview_value", { length: 255 }),
});

export const nemplateNumberVariables = pgTable("number_template_variable", {
    id: integer("id").primaryKey(),
    minValue: decimal("min_value"),
    maxValue: decimal("max_value"),
    decimalPlaces: integer("decimal_places"),
    previewValue: decimal("preview_value"),
});

export const templateDateVariables = pgTable("date_template_variable", {
    id: integer("id").primaryKey(),
    minDate: timestamp("min_date", { precision: 3 }),
    maxDate: timestamp("max_date", { precision: 3 }),
    format: varchar("format", { length: 50 }),
    previewValue: timestamp("preview_value", { precision: 3 }),
});

export const templateSelectVariables = pgTable("select_template_variable", {
    id: integer("id").primaryKey(),
    options: json("options"),
    multiple: boolean("multiple"),
    previewValue: varchar("preview_value", { length: 255 }),
});