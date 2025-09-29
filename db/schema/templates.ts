import {
    pgTable,
    serial,
    varchar,
    text,
    integer,
    timestamp,
    bigint,
    pgEnum,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
    certificates,
    templateRecipientGroups,
    templateVariableBases,
    templateElements,
} from ".";

export const categorySpecialTypeEnum = pgEnum("CategorySpecialType", [
    "Main",
    "Suspension",
]);

export const templateCategories = pgTable(
    "TemplateCategory",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        parentCategoryId: integer("parentCategoryId"),
        order: integer("order"),
        categorySpecialType: categorySpecialTypeEnum("categorySpecialType"),
        createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
        updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("TemplateCategory_categorySpecialType_key").on(
            table.categorySpecialType,
        ),
    ],
);

export const templates = pgTable("Template", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    imageFileId: bigint("imageFileId", { mode: "bigint" }),
    categoryId: integer("categoryId").notNull(),
    order: integer("order").notNull(),
    preSuspensionCategoryId: integer("preSuspensionCategoryId"),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
});

export const templateConfigKeyEnum = pgEnum("TemplateConfigKey", [
    "MAX_BACKGROUND_SIZE",
    "ALLOWED_FILE_TYPES",
]);

export const templateConfigs = pgTable("TemplateConfigs", {
    key: templateConfigKeyEnum("key").primaryKey(),
    value: text("value").notNull(),
});

export const templateCategoriesRelations = relations(
    templateCategories,
    ({ one, many }) => ({
        parentCategory: one(templateCategories, {
            fields: [templateCategories.parentCategoryId],
            references: [templateCategories.id],
        }),
        subCategories: many(templateCategories),
        templates: many(templates),
        preSuspensionTemplates: many(templates),
    }),
);

export const templatesRelations = relations(templates, ({ one, many }) => ({
    category: one(templateCategories, {
        fields: [templates.categoryId],
        references: [templateCategories.id],
    }),
    preSuspensionCategory: one(templateCategories, {
        fields: [templates.preSuspensionCategoryId],
        references: [templateCategories.id],
    }),
    certificates: many(certificates),
    recipientGroups: many(templateRecipientGroups),
    templateVariables: many(templateVariableBases),
    elements: many(templateElements),
}));
