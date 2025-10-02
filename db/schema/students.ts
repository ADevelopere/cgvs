import {
    pgTable,
    serial,
    varchar,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["MALE", "FEMALE", "OTHER"]);
export const countryCodeEnum = pgEnum("cuntry_code", ["EG", "US"]);

export const students = pgTable("student", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phoneNumber: varchar("phone_number", { length: 255 }),
    dateOfBirth: timestamp("date_of_birth", { precision: 3 }),
    gender: genderEnum("gender"),
    nationality: countryCodeEnum("nationality"),
    createdAt: timestamp("created_at", { precision: 3 }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 3 }).notNull(),
});
