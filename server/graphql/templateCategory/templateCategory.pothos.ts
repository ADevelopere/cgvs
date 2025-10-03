import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    TemplateCategoryCreateInput,
    TemplateCategoryPothosDefintion,
    TemplateCategoryUpdateInput,
} from "./templateCategory.types";
import {
    loadSubTemplateCategoriesForCategories,
    loadTemplateCategoriesByIds,
} from "./templateCategory.repository";
import { TemplatePothosObject } from "../template/template.pothos";
import { loadTemplatesForTemplateCategories } from "../template/template.repository";

const TemplateCategoryObjectRef =
    gqlSchemaBuilder.objectRef<TemplateCategoryPothosDefintion>(
        "TemplateCategory",
    );

export const TemplateCategoryPothosObject = gqlSchemaBuilder.loadableObject<
    TemplateCategoryPothosDefintion | Error, // LoadResult
    number, // Key
    [], // Interfaces
    typeof TemplateCategoryObjectRef // NameOrRef
>(TemplateCategoryObjectRef, {
    load: async (ids: number[]) => await loadTemplateCategoriesByIds(ids),
    sort: (c) => c.id,
    fields: (t) => ({
        id: t.exposeInt("id", { nullable: false }),
        name: t.exposeString("name", { nullable: false }),
        description: t.exposeString("description", { nullable: true }),
        order: t.exposeInt("order", { nullable: true }),
        specialType: t.exposeString("specialType", { nullable: true }),
        createdAt: t.expose("createdAt", { type: "DateTime", nullable: false }),
        updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: false }),
    }),
});

gqlSchemaBuilder.objectFields(TemplateCategoryPothosObject, (t) => ({
    templates: t.loadableList({
        type: TemplatePothosObject,
        load: (ids: number[]) => loadTemplatesForTemplateCategories(ids),
        resolve: (templateCategory) => templateCategory.id,
    }),
    parentCategory: t.loadable({
        type: TemplateCategoryPothosObject,
        load: (ids: number[], ctx) =>
            TemplateCategoryPothosObject.getDataloader(ctx).loadMany(ids),
        resolve: (templateCategory) => templateCategory.parentCategoryId,
    }),
    subCategories: t.loadableList({
        type: TemplateCategoryPothosObject,
        load: (ids: number[]) => loadSubTemplateCategoriesForCategories(ids),
        resolve: (parentTemplateCategory) => parentTemplateCategory.id,
    }),
}));

const TemplateCategoryCreateInputRef =
    gqlSchemaBuilder.inputRef<TemplateCategoryCreateInput>(
        "TemplateCategoryCreateInput",
    );

export const TemplateCategoryCreateInputObject =
    TemplateCategoryCreateInputRef.implement({
        fields: (t) => ({
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            parentCategoryId: t.int({ required: false }),
        }),
    });

const TemplateCategoryUpdateInputRef =
    gqlSchemaBuilder.inputRef<TemplateCategoryUpdateInput>(
        "TemplateCategoryUpdateInput",
    );

export const TemplateCategoryUpdateInputPothosObject =
    TemplateCategoryUpdateInputRef.implement({
        fields: (t) => ({
            id: t.int({ required: true }),
            name: t.string({ required: true }),
            parentCategoryId: t.int({ required: false }),
            description: t.string({ required: false }),
        }),
    });
