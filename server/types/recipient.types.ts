import * as Db from "@/server/db/schema";

export type RecipientEntity =
    typeof Db.templateRecipientGroupItems.$inferSelect;

export type RecipientEntityInput =
    typeof Db.templateRecipientGroupItems.$inferInsert;

export type RecipientCreateInput = {
    recipientGroupId: number;
    studentId: number;
};

export type RecipientCreateListInput = {
    recipientGroupId: number;
    studentIds: number[];
};
