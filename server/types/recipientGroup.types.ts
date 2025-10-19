import * as Db from "@/server/db/schema";

export type RecipientGroupEntity =
  typeof Db.templateRecipientGroups.$inferSelect;
export type RecipientGroupEntityInput =
  typeof Db.templateRecipientGroups.$inferInsert;

export type RecipientGroupCreateInput = {
  templateId: number;
  name: string;
  description?: string | null;
  date?: Date | null;
};

export type RecipientGroupUpdateInput = {
  id: number;
  name: string;
  description?: string | null;
  date?: Date | null;
};
