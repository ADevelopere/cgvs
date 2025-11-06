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
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const templatecategorySpecialTypeEnum = pgEnum("category_special_type", ["Main", "Suspension"]);

export const templateCategories = pgTable(
  "TemplateCategory",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    parentCategoryId: integer("parent_category_id"),
    order: integer("order").notNull(),
    specialType: templatecategorySpecialTypeEnum("special_type"),
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
  },
  table => [
    uniqueIndex("template_category_special_type_key").on(table.specialType),
    // GIN index for Full-Text Search on 'name' column
    index("idx_template_categories_name_fts").using("gin", sql`to_tsvector('simple', ${table.name})`),
    // GiST index for faster LIKE/ILIKE on name using pg_trgm
    index("idx_template_categories_name_trgm").using("gist", table.name.op("gist_trgm_ops")),
  ]
);

export const templates = pgTable(
  "template",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    imageFileId: bigint("image_file_id", { mode: "bigint" }),
    categoryId: integer("category_id").notNull(),
    order: integer("order").notNull(),
    preSuspensionCategoryId: integer("pre_suspension_category_id"),
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
  },
  table => [
    // GIN index for Full-Text Search on 'name' column
    index("idx_templates_name_fts").using("gin", sql`to_tsvector('simple', ${table.name})`),

    // GiST index for faster LIKE/ILIKE on name using pg_trgm
    index("idx_templates_name_trgm").using("gist", table.name.op("gist_trgm_ops")),
  ]
);

export const templatesConfigsKeyEnum = pgEnum("template_config_key", ["MAX_BACKGROUND_SIZE", "ALLOWED_FILE_TYPES"]);

export const templatesConfigs = pgTable("templates_config", {
  key: templatesConfigsKeyEnum("key").primaryKey(),
  value: text("value").notNull(),
});
