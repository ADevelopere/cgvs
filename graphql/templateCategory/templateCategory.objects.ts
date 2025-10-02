import { schemaBuilder } from "../builder";
import {
    TemplateCategoryCreateInput,
    TemplateCategoryPothosDefintion,
    TemplateCategoryUpdateInput,
} from "./templateCategory.types";
import {
    loadSubTemplateCategoriesForCategories,
    loadTemplateCategoriesByIds,
} from "./templateCategory.repository";
import { TemplatePothosObject } from "../template/template.objects";
import { loadTemplatesForTemplateCategories } from "../template/template.repository";

const TemplateCategoryObjectRef =
    schemaBuilder.objectRef<TemplateCategoryPothosDefintion>(
        "TemplateCategory",
    );

export const TemplateCategoryObject = schemaBuilder.loadableObject<
    TemplateCategoryPothosDefintion | Error, // LoadResult
    number, // Key
    [], // Interfaces
    typeof TemplateCategoryObjectRef // NameOrRef
>(TemplateCategoryObjectRef, {
    load: async (ids: number[]) => await loadTemplateCategoriesByIds(ids),
    sort: (c) => c.id,
    fields: (t) => ({
        id: t.exposeInt("id"),
        name: t.exposeString("name"),
        description: t.exposeString("description", { nullable: true }),
        order: t.exposeInt("order", { nullable: true }),
        specialType: t.exposeString("specialType", { nullable: true }),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    }),
});

schemaBuilder.objectFields(TemplateCategoryObject, (t) => ({
    templates: t.loadableList({
        type: TemplatePothosObject,
        load: (ids: number[]) => loadTemplatesForTemplateCategories(ids),
        resolve: (templateCategory) => templateCategory.id,
    }),
    parentCategory: t.loadable({
        type: TemplateCategoryObject,
        load: (ids: number[]) =>
            TemplateCategoryObject.getDataloader(ids).loadMany(ids),
        resolve: (templateCategory) => templateCategory.parentCategoryId,
    }),
    subCategories: t.loadableList({
        type: TemplateCategoryObject,
        load: (ids: number[]) => loadSubTemplateCategoriesForCategories(ids),
        resolve: (parentTemplateCategory) => parentTemplateCategory.id,
    }),
}));

const TemplateCategoryCreateInputRef =
    schemaBuilder.inputRef<TemplateCategoryCreateInput>(
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
    schemaBuilder.inputRef<TemplateCategoryUpdateInput>(
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
