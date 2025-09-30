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
import { relations } from "drizzle-orm/_relations";
import { templates } from ".";

export const templateVariableTypeEnum = pgEnum("TemplateVariableType", [
    "TEXT",
    "NUMBER",
    "DATE",
    "SELECT",
]);

export const templateVariableBases = pgTable(
    "TemplateVariableBase",
    {
        id: serial("id").primaryKey(),
        templateId: integer("templateId").notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        type: templateVariableTypeEnum("type").notNull(),
        required: boolean("required").notNull().default(false),
        order: integer("order").notNull(),
        createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
        updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("TemplateVariableBase_templateId_name_key").on(
            table.templateId,
            table.name,
        ),
    ],
);

export const textTemplateVariables = pgTable("TextTemplateVariable", {
    id: integer("id").primaryKey(),
    minLength: integer("minLength"),
    maxLength: integer("maxLength"),
    pattern: varchar("pattern", { length: 255 }),
    previewValue: varchar("previewValue", { length: 255 }),
});

export const numberTemplateVariables = pgTable("NumberTemplateVariable", {
    id: integer("id").primaryKey(),
    minValue: decimal("minValue"),
    maxValue: decimal("maxValue"),
    decimalPlaces: integer("decimalPlaces"),
    previewValue: decimal("previewValue"),
});

export const dateTemplateVariables = pgTable("DateTemplateVariable", {
    id: integer("id").primaryKey(),
    minDate: timestamp("minDate", { precision: 3 }),
    maxDate: timestamp("maxDate", { precision: 3 }),
    format: varchar("format", { length: 50 }),
    previewValue: timestamp("previewValue", { precision: 3 }),
});

export const selectTemplateVariables = pgTable("SelectTemplateVariable", {
    id: integer("id").primaryKey(),
    options: json("options"),
    multiple: boolean("multiple"),
    previewValue: varchar("previewValue", { length: 255 }),
});

export const templateVariableBasesRelations = relations(
    templateVariableBases,
    ({ one }) => ({
        template: one(templates, {
            fields: [templateVariableBases.templateId],
            references: [templates.id],
        }),
        textTemplateVariable: one(textTemplateVariables, {
            fields: [templateVariableBases.id],
            references: [textTemplateVariables.id],
        }),
        numberTemplateVariable: one(numberTemplateVariables, {
            fields: [templateVariableBases.id],
            references: [numberTemplateVariables.id],
        }),
        dateTemplateVariable: one(dateTemplateVariables, {
            fields: [templateVariableBases.id],
            references: [dateTemplateVariables.id],
        }),
        selectTemplateVariable: one(selectTemplateVariables, {
            fields: [templateVariableBases.id],
            references: [selectTemplateVariables.id],
        }),
    }),
);
