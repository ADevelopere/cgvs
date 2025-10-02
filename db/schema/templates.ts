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

export const templatecategorySpecialTypeEnum = pgEnum("CategorySpecialType", [
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
        specialType: templatecategorySpecialTypeEnum("specialType"),
        createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
        updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("TemplateCategory_specialType_key").on(
            table.specialType,
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