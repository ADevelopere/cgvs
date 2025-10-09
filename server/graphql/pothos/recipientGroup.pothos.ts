import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplatePothosObject } from "./template.pothos";
import * as TrgTypes from "@/server/types";
import { TemplateRepository } from "@/server/db/repo";

export const TemplateRecipientGroupPothosObject = gqlSchemaBuilder
    .objectRef<TrgTypes.TemplateRecipientGroupPothosDefinition>(
        "TemplateRecipientGroup",
    )
    .implement({
        fields: (t) => ({
            id: t.exposeInt("id"),
            name: t.exposeString("name"),
            description: t.exposeString("description"),
            date: t.expose("date", { type: "DateTime", nullable: true }),
            createdAt: t.expose("createdAt", {
                type: "DateTime",
                nullable: true,
            }),
            updatedAt: t.expose("updatedAt", {
                type: "DateTime",
                nullable: true,
            }),
        }),
    });

gqlSchemaBuilder.objectFields(TemplateRecipientGroupPothosObject, (t) => ({
    template: t.loadable({
        type: TemplatePothosObject,
        load: (ids: number[]) => TemplateRepository.loadByIds(ids),
        resolve: (templateGroup) => templateGroup.templateId,
    }),
    // todo: items
}));

export const TemplateRecipientGroupCreateInputPothosObject = gqlSchemaBuilder
    .inputRef<TrgTypes.TemplateRecipientGroupCreateInput>(
        "TemplateRecipientGroupCreateInput",
    )
    .implement({
        fields: (t) => ({
            templateId: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            date: t.field({ type: "DateTime", required: false }),
        }),
    });

export const TemplateRecipientGroupUpdateInputPothosObject = gqlSchemaBuilder
    .inputRef<TrgTypes.TemplateRecipientGroupUpdateInput>(
        "TemplateRecipientGroupUpdateInput",
    )
    .implement({
        fields: (t) => ({
            id: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            date: t.field({ type: "DateTime", required: false }),
        }),
    });
