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

export const templatecategorySpecialTypeEnum = pgEnum("category_special_type", [
    "Main",
    "Suspension",
]);

export const templateCategories = pgTable(
    "TemplateCategory",
    {
        id: serial("id").primaryKey(),
        name: varchar("name", { length: 255 }).notNull(),
        description: text("description"),
        parentCategoryId: integer("parent_category_id"),
        order: integer("order"),
        specialType: templatecategorySpecialTypeEnum("special_type"),
        createdAt: timestamp("created_at", { precision: 3 }).notNull(),
        updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("template_category_special_type_key").on(table.specialType),
    ],
);

export const templates = pgTable("template", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    imageFileId: bigint("image_file_id", { mode: "bigint" }),
    categoryId: integer("category_id").notNull(),
    order: integer("order").notNull(),
    preSuspensionCategoryId: integer("pre_suspension_category_id"),
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});

export const templatesConfigsKeyEnum = pgEnum("template_config_key", [
    "MAX_BACKGROUND_SIZE",
    "ALLOWED_FILE_TYPES",
]);

export const templatesConfigs = pgTable("templates_config", {
    key: templatesConfigsKeyEnum("key").primaryKey(),
    value: text("value").notNull(),
});
