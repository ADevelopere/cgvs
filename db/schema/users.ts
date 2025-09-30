import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    integer,
    varchar,
    index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/_relations";

export const users = pgTable("Users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    emailVerifiedAt: timestamp("emailVerifiedAt", { precision: 3 }),
    password: varchar("password", { length: 255 }).notNull(),
    isAdmin: boolean("isAdmin").notNull().default(false),
    rememberToken: varchar("rememberToken", { length: 100 }),
    createdAt: timestamp("createdAt", { precision: 3 }).notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 }).notNull(),
});

export const sessions = pgTable(
    "Session",
    {
        id: varchar("id", { length: 255 }).primaryKey(),
        userId: integer("userId"),
        ipAddress: varchar("ipAddress", { length: 45 }),
        userAgent: text("userAgent"),
        payload: text("payload").notNull(),
        lastActivity: integer("lastActivity").notNull(),
    },
    (table) => [
        index("sessions_user_id_index").on(table.userId),
        index("sessions_last_activity_index").on(table.lastActivity),
    ],
);

export const passwordResetTokens = pgTable("PasswordResetTokens", {
    email: varchar("email", { length: 255 }).primaryKey(),
    token: varchar("token", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt", { precision: 3 }),
});

export const usersRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));
