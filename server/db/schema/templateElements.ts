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

export const elementTypeEnum = pgEnum("template_element_type", [
  "static_text",
  "data_text",
  "data_date",
  "image",
  "qr_code",
]);
export const templateElementSourceTypeEnum = pgEnum(
  "template_element_source_type",
  ["student", "variable", "certificate"]
);

export const templateElements = pgTable("template_element", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  type: elementTypeEnum("type").notNull(),
  xCoordinate: real("x_coordinate").notNull(),
  yCoordinate: real("y_coordinate").notNull(),
  fontSize: integer("font_size"),
  color: varchar("color", { length: 20 }),
  alignment: varchar("alignment", { length: 20 }),
  fontFamily: varchar("font_family", { length: 100 }),
  languageConstraint: varchar("language_constraint", { length: 10 }),
  createdAt: timestamp("created_at", { precision: 3 }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});

export const templateStaticTextElements = pgTable(
  "template_static_text_element",
  {
    elementId: integer("element_id").primaryKey(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
  }
);

export const templateDataTextElements = pgTable("template_data_text_element", {
  elementId: integer("element_id").primaryKey(),
  sourceType: templateElementSourceTypeEnum("source_type").notNull(),
  sourceField: varchar("source_field", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { precision: 3 }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});

export const templateQrCodeElements = pgTable("template_qr_code_element", {
  elementId: integer("element_id").primaryKey(),
  size: integer("size"),
  createdAt: timestamp("created_at", { precision: 3 }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});

export const templateImageElements = pgTable("template_image_element", {
  elementId: integer("element_id").primaryKey(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  width: integer("width"),
  height: integer("height"),
  createdAt: timestamp("created_at", { precision: 3 }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});

export const templateDataDateElements = pgTable("template_data_date_element", {
  elementId: integer("element_id").primaryKey(),
  sourceType: templateElementSourceTypeEnum("source_type").notNull(),
  sourceField: varchar("source_field", { length: 100 }).notNull(),
  dateFormat: varchar("date_format", { length: 50 }),
  createdAt: timestamp("created_at", { precision: 3 }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});
