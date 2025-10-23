import {
  pgTable,
  serial,
  integer,
  timestamp,
  varchar,
  text,
  uniqueIndex,
  index,
  jsonb,
} from "drizzle-orm/pg-core";

export const templateRecipientGroups = pgTable("template_recipient_group", {
  id: serial("id").primaryKey(),
  templateId: integer("template_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date", { precision: 3 }),
  createdAt: timestamp("created_at", { precision: 3 }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});

export const templateRecipientGroupItems = pgTable(
  "template_recipient_group_item",
  {
    id: serial("id").primaryKey(),
    recipientGroupId: integer("template_recipient_group_id").notNull(),
    studentId: integer("student_id").notNull(),
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
  },
  table => [
    uniqueIndex("trgi_student_group_unique").on(
      table.studentId,
      table.recipientGroupId
    ),
  ]
);

// Type definition for the JSONB structure
export type TemplateVariableValuesMap = {
  [variableId: string]: {
    type: "TEXT" | "NUMBER" | "DATE" | "SELECT";
    value: string | number | string[] | null;
  };
};

export const recipientGroupItemVariableValues = pgTable(
  "recipient_group_item_variable_value",
  {
    id: serial("id").primaryKey(),

    // Links to recipient
    templateRecipientGroupItemId: integer(
      "template_recipient_group_item_id"
    ).notNull(),

    // Denormalized for direct queries (avoid joins)
    templateId: integer("template_id").notNull(),
    recipientGroupId: integer("recipient_group_id").notNull(),
    studentId: integer("student_id").notNull(),

    // All variables in JSONB
    variableValues: jsonb("variable_values")
      .$type<TemplateVariableValuesMap>()
      .notNull()
      .default({}),

    // Metadata
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
  },
  table => [
    // One row per recipient
    uniqueIndex("rgiv_group_item_unique").on(
      table.templateRecipientGroupItemId
    ),

    // Fast lookups
    index("rgiv_student_idx").on(table.studentId),
    index("rgiv_template_idx").on(table.templateId),
    index("rgiv_recipient_group_idx").on(table.recipientGroupId),

    // Enable JSONB queries
    index("rgiv_variable_values_gin_idx").using("gin", table.variableValues),
  ]
);
