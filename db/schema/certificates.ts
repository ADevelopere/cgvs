import {
    pgTable,
    serial,
    integer,
    timestamp,
    varchar,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import {
    templates,
    students,
    templateRecipientGroups,
} from ".";
import { relations } from "drizzle-orm/_relations";

export const certificates = pgTable(
    "Certificate",
    {
        id: serial("id").primaryKey(),
        templateId: integer("templateId").notNull(),
        studentId: integer("studentId").notNull(),
        templateRecipientGroupId: integer("templateRecipientGroupId").notNull(),
        releaseDate: timestamp("releaseDate", { precision: 3 }).notNull(),
        verificationCode: varchar("verificationCode", { length: 255 })
            .notNull()
            .unique(),
        deletedAt: timestamp("deletedAt", { precision: 3 }),
        createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
        updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
    },
    (table) => [
        uniqueIndex("unique_student_template_certificate").on(
            table.templateId,
            table.studentId,
        ),
    ],
);

export const certificatesRelations = relations(certificates, ({ one }) => ({
    template: one(templates, {
        fields: [certificates.templateId],
        references: [templates.id],
    }),
    student: one(students, {
        fields: [certificates.studentId],
        references: [students.id],
    }),
    templateRecipientGroup: one(templateRecipientGroups, {
        fields: [certificates.templateRecipientGroupId],
        references: [templateRecipientGroups.id],
    }),
}));

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
