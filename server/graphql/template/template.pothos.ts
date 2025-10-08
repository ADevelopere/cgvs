import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    PaginatedTemplatesResponse,
    TemplatePothosDefintion,
    TemplateCreateInput,
    TemplateUpdateInput,
    TemplatesConfigPothosDefinition,
    TemplatesConfigsKeyValues,
    TemplatesConfigsPothosDefinition,
} from "./template.types";
import { PageInfoObject } from "../pagintaion/pagination.objects";
import { TemplateCategoryPothosObject } from "../templateCategory/templateCategory.pothos";
import { getStorageService } from "@/server/storage/storage.service";
import { TemplateVariablePothosInterface } from "../templateVariable/templateVariable.pothos";
import { TemplateVariableRepository as TmvRepo } from "../templateVariable/templateVariable.repository";

import { TemplateRepository } from "./template.repository";

export const TemplatePothosObject = gqlSchemaBuilder
    .loadableObjectRef<TemplatePothosDefintion, number>("Template", {
        load: async (ids: number[]) => TemplateRepository.loadByIds(ids),
        sort: (t) => t.id,
    })
    .implement({
        fields: (t) => ({
            id: t.exposeInt("id", { nullable: false }),
            name: t.exposeString("name", { nullable: true }),
            description: t.exposeString("description", { nullable: true }),
            order: t.exposeInt("order", { nullable: true }),
            createdAt: t.expose("createdAt", {
                type: "DateTime",
                nullable: true,
            }),
            updatedAt: t.expose("updatedAt", {
                type: "DateTime",
                nullable: true,
            }),
            imageUrl: t.string({
                nullable: true,
                resolve: async (template) => {
                    if (template.imageFileId) {
                        const imageFileInfo = await (
                            await getStorageService()
                        ).fileInfoByDbFileId(template.imageFileId);
                        return imageFileInfo?.url;
                    }
                    return null;
                },
            }),
        }),
    });

gqlSchemaBuilder.objectFields(TemplatePothosObject, (t) => ({
    category: t.loadable({
        type: TemplateCategoryPothosObject,
        load: (ids: number[], ctx) =>
            TemplateCategoryPothosObject.getDataloader(ctx).loadMany(ids),
        resolve: (template) => template.categoryId,
    }),
    preSuspensionCategory: t.loadable({
        type: TemplateCategoryPothosObject,
        load: (ids: number[], ctx) =>
            TemplateCategoryPothosObject.getDataloader(ctx).loadMany(ids),
        resolve: (template) => template.preSuspensionCategoryId,
    }),
    variables: t.loadableList({
        type: TemplateVariablePothosInterface,
        load: (ids: number[]) => TmvRepo.loadForTemplates(ids),
        resolve: (template) => template.id,
    }),

    // TODO
    // imageFile: FileInfo | null;
    // recipientGroups
    // driven
}));

export const TemplateCreateInputPothosObject = gqlSchemaBuilder
    .inputRef<TemplateCreateInput>("TemplateCreateInput")
    .implement({
        fields: (t) => ({
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            categoryId: t.int({ required: true }),
        }),
    });

export const TemplateUpdateInputPothosObject = gqlSchemaBuilder
    .inputRef<TemplateUpdateInput>("TemplateUpdateInput")
    .implement({
        fields: (t) => ({
            id: t.int({ required: true }),
            name: t.string({ required: true }),
            categoryId: t.int({ required: true }),
            description: t.string({ required: false }),
        }),
    });

export const PaginatedTemplatesResponsePothosObject = gqlSchemaBuilder
    .objectRef<PaginatedTemplatesResponse>("PaginatedTemplatesResponse")
    .implement({
        fields: (t) => ({
            data: t.expose("data", { type: [TemplatePothosObject] }),
            pageInfo: t.expose("pageInfo", { type: PageInfoObject }),
        }),
    });

export const TemplatesConfigsKeyPothosObject = gqlSchemaBuilder.enumType(
    "TemplatesConfigsKey",
    {
        values: TemplatesConfigsKeyValues,
    },
);

export const TemplatesConfigPothosObject = gqlSchemaBuilder
    .objectRef<TemplatesConfigPothosDefinition>("TemplatesConfig")
    .implement({
        fields: (t) => ({
            key: t.expose("key", { type: TemplatesConfigsKeyPothosObject }),
            value: t.exposeString("value"),
        }),
    });

export const TemplatesConfigsPothosObject = gqlSchemaBuilder
    .objectRef<TemplatesConfigsPothosDefinition>("TemplatesConfigs")
    .implement({
        fields: (t) => ({
            configs: t.expose("configs", {
                type: [TemplatesConfigPothosObject],
            }),
        }),
    });
