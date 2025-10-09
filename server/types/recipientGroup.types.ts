import * as Db from "@/server/db/schema";
import { TemplatePothosDefintion } from "./template.types";

export type TemplateRecipientGroupEntity =
    typeof Db.templateRecipientGroups.$inferSelect;
export type TemplateRecipientGroupEntityInput =
    typeof Db.templateRecipientGroups.$inferInsert;

export type TemplateRecipientGroupPothosDefinition =
    TemplateRecipientGroupEntity & {
        template?: TemplatePothosDefintion;
        // todo: items
    };

export type TemplateRecipientGroupCreateInput = {
    templateId: number;
    name: string;
    description?: string | null;
    date?: Date | null;
};

export type TemplateRecipientGroupUpdateInput = {
    id: number;
    name: string;
    description?: string | null;
    date?: Date | null;
};
