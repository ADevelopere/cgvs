import {
    pgTable,
    serial,
    integer,
    timestamp,
    varchar,
    text,
    uniqueIndex,
    index,
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
    (table) => [
        uniqueIndex("trgi_student_group_unique").on(
            table.studentId,
            table.recipientGroupId,
        ),
    ],
);

export const recipientGroupItemVariableValues = pgTable(
    "recipient_group_item_variable_value",
    {
        id: serial("id").primaryKey(),
        templateRecipientGroupItemId: integer(
            "template_recipient_group_item_id",
        ).notNull(),
        templateVariableId: integer("templateVariableId").notNull(),
        value: text("value"),
        valueIndexed: varchar("value_indexed", { length: 255 }),
        createdAt: timestamp("created_at", { precision: 3 }).notNull(),
        updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("rgiv_group_item_variable_unique").on(
            table.templateRecipientGroupItemId,
            table.templateVariableId,
        ),
        index("rgiv_value_idx").on(table.valueIndexed),
    ],
);
