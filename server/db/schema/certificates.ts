import { pgTable, serial, integer, timestamp, varchar, uniqueIndex } from "drizzle-orm/pg-core";

export const certificates = pgTable(
  "certificate",
  {
    id: serial("id").primaryKey(),
    templateId: integer("template_id").notNull(),
    studentId: integer("student_id").notNull(),
    templateRecipientGroupId: integer("template_recipient_group_id").notNull(),
    releaseDate: timestamp("release_date", { precision: 3 }).notNull(),
    verificationCode: varchar("verification_code", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
  },
  table => [uniqueIndex("unique_student_template_certificate").on(table.templateId, table.studentId)]
);
