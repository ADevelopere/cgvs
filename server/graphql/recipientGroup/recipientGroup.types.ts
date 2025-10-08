import * as Db from "@/server/db/schema";
import { TemplatePothosDefintion } from "../template/template.types";
import { OmitEntityFields } from "../gqlHelper";

export type TemplateRecipientGroupEntity =
    typeof Db.templateRecipientGroups.$inferSelect;
export type TemplateRecipientGroupEntityInput =
    typeof Db.templateRecipientGroups.$inferInsert;

export type TemplateRecipientGroupPothosDefinition =
    TemplateRecipientGroupEntity & {
        template?: TemplatePothosDefintion;
        // todo: items
    };

export type TemplateRecipientGroupCreateInput =
    OmitEntityFields<TemplateRecipientGroupEntityInput>;

export type TemplateRecipientGroupUpdateInput = Omit<
    TemplateRecipientGroupEntityInput,
    "templateId" | "createdAt" | "updatedAt"
>;
