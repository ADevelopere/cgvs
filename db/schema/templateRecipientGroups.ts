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
import { relations } from "drizzle-orm/_relations";
import { templates } from "./templates";
import { certificates, students, templateVariableBases } from ".";

export const templateRecipientGroups = pgTable("TemplateRecipientGroup", {
    id: serial("id").primaryKey(),
    templateId: integer("templateId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    date: timestamp("date", { precision: 3 }),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
});

export const templateRecipientGroupItems = pgTable(
    "TemplateRecipientGroupItem",
    {
        id: serial("id").primaryKey(),
        templateRecipientGroupId: integer("templateRecipientGroupId").notNull(),
        studentId: integer("studentId").notNull(),
        createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
        updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("trgi_student_group_unique").on(
            table.studentId,
            table.templateRecipientGroupId,
        ),
    ],
);

export const recipientGroupItemVariableValues = pgTable(
    "RecipientGroupItemVariableValue",
    {
        id: serial("id").primaryKey(),
        templateRecipientGroupItemId: integer(
            "templateRecipientGroupItemId",
        ).notNull(),
        templateVariableId: integer("templateVariableId").notNull(),
        value: text("value"),
        valueIndexed: varchar("valueIndexed", { length: 255 }),
        createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
        updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("rgiv_group_item_variable_unique").on(
            table.templateRecipientGroupItemId,
            table.templateVariableId,
        ),
        index("rgiv_value_idx").on(table.valueIndexed),
    ],
);

export const templateRecipientGroupsRelations = relations(
    templateRecipientGroups,
    ({ one, many }) => ({
        template: one(templates, {
            fields: [templateRecipientGroups.templateId],
            references: [templates.id],
        }),
        items: many(templateRecipientGroupItems),
        certificates: many(certificates),
    }),
);

export const templateRecipientGroupItemsRelations = relations(
    templateRecipientGroupItems,
    ({ one, many }) => ({
        templateRecipientGroup: one(templateRecipientGroups, {
            fields: [templateRecipientGroupItems.templateRecipientGroupId],
            references: [templateRecipientGroups.id],
        }),
        student: one(students, {
            fields: [templateRecipientGroupItems.studentId],
            references: [students.id],
        }),
        variableValues: many(recipientGroupItemVariableValues),
    }),
);

export const recipientGroupItemVariableValuesRelations = relations(
    recipientGroupItemVariableValues,
    ({ one }) => ({
        templateRecipientGroupItem: one(templateRecipientGroupItems, {
            fields: [
                recipientGroupItemVariableValues.templateRecipientGroupItemId,
            ],
            references: [templateRecipientGroupItems.id],
        }),
        templateVariable: one(templateVariableBases, {
            fields: [recipientGroupItemVariableValues.templateVariableId],
            references: [templateVariableBases.id],
        }),
    }),
);
