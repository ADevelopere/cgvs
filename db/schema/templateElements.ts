import {
    pgTable,
    serial,
    integer,
    real,
    varchar,
    timestamp,
    text,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/_relations";
import { templates } from ".";

export const elementTypeEnum = pgEnum("ElementType", [
    "static_text",
    "data_text",
    "data_date",
    "image",
    "qr_code",
]);
export const templateElementSourceTypeEnum = pgEnum(
    "TemplateElementSourceType",
    ["student", "variable", "certificate"],
);

export const templateElements = pgTable("TemplateElements", {
    id: serial("id").primaryKey(),
    templateId: integer("templateId").notNull(),
    type: elementTypeEnum("type").notNull(),
    xCoordinate: real("xCoordinate").notNull(),
    yCoordinate: real("yCoordinate").notNull(),
    fontSize: integer("fontSize"),
    color: varchar("color", { length: 20 }),
    alignment: varchar("alignment", { length: 20 }),
    fontFamily: varchar("fontFamily", { length: 100 }),
    languageConstraint: varchar("languageConstraint", { length: 10 }),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
});

export const templateStaticTextElements = pgTable(
    "TemplateStaticTextElements",
    {
        elementId: integer("elementId").primaryKey(),
        content: text("content").notNull(),
        createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
        updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
    },
);

export const templateDataTextElements = pgTable("TemplateDataTextElements", {
    elementId: integer("elementId").primaryKey(),
    sourceType: templateElementSourceTypeEnum("sourceType").notNull(),
    sourceField: varchar("sourceField", { length: 100 }).notNull(),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
});

export const templateQrCodeElements = pgTable("TemplateQrCodeElements", {
    elementId: integer("elementId").primaryKey(),
    size: integer("size"),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
});

export const templateImageElements = pgTable("TemplateImageElements", {
    elementId: integer("elementId").primaryKey(),
    imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
    width: integer("width"),
    height: integer("height"),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
});

export const templateDataDateElements = pgTable("TemplateDataDateElements", {
    elementId: integer("elementId").primaryKey(),
    sourceType: templateElementSourceTypeEnum("sourceType").notNull(),
    sourceField: varchar("sourceField", { length: 100 }).notNull(),
    dateFormat: varchar("dateFormat", { length: 50 }),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
});

export const templateElementsRelations = relations(
    templateElements,
    ({ one }) => ({
        template: one(templates, {
            fields: [templateElements.templateId],
            references: [templates.id],
        }),
        staticTextElement: one(templateStaticTextElements, {
            fields: [templateElements.id],
            references: [templateStaticTextElements.elementId],
        }),
        dataTextElement: one(templateDataTextElements, {
            fields: [templateElements.id],
            references: [templateDataTextElements.elementId],
        }),
        dataDateElement: one(templateDataDateElements, {
            fields: [templateElements.id],
            references: [templateDataDateElements.elementId],
        }),
        imageElement: one(templateImageElements, {
            fields: [templateElements.id],
            references: [templateImageElements.elementId],
        }),
        qrCodeElement: one(templateQrCodeElements, {
            fields: [templateElements.id],
            references: [templateQrCodeElements.elementId],
        }),
    }),
);

export const templateStaticTextElementsRelations = relations(
    templateStaticTextElements,
    ({ one }) => ({
        element: one(templateElements, {
            fields: [templateStaticTextElements.elementId],
            references: [templateElements.id],
        }),
    }),
);

export const templateDataTextElementsRelations = relations(
    templateDataTextElements,
    ({ one }) => ({
        element: one(templateElements, {
            fields: [templateDataTextElements.elementId],
            references: [templateElements.id],
        }),
    }),
);

export const templateQrCodeElementsRelations = relations(
    templateQrCodeElements,
    ({ one }) => ({
        element: one(templateElements, {
            fields: [templateQrCodeElements.elementId],
            references: [templateElements.id],
        }),
    }),
);

export const templateImageElementsRelations = relations(
    templateImageElements,
    ({ one }) => ({
        element: one(templateElements, {
            fields: [templateImageElements.elementId],
            references: [templateElements.id],
        }),
    }),
);

export const templateDataDateElementsRelations = relations(
    templateDataDateElements,
    ({ one }) => ({
        element: one(templateElements, {
            fields: [templateDataDateElements.elementId],
            references: [templateElements.id],
        }),
    }),
);
