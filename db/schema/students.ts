import {
    pgTable,
    serial,
    varchar,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { certificates, templateRecipientGroupItems } from ".";

export const genderEnum = pgEnum("Gender", ["MALE", "FEMALE", "OTHER"]);
export const countryCodeEnum = pgEnum("CountryCode", ["EG", "US"]);

export const students = pgTable("Student", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phoneNumber: varchar("phoneNumber", { length: 255 }),
    dateOfBirth: timestamp("dateOfBirth", { precision: 3 }),
    gender: genderEnum("gender"),
    nationality: countryCodeEnum("nationality"),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
});

export const studentsRelations = relations(students, ({ many }) => ({
    recipientGroupItems: many(templateRecipientGroupItems),
    certificates: many(certificates),
}));
