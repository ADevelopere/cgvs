import { schemaBuilder } from "../builder";
import { TemplateCategory } from "./templateCategory.types";
import {
    loadSubTemplateCategoriesForCategories,
    loadTemplateCategoriesByIds,
} from "./templateCategory.repository";
import { TemplateObject } from "../template/template.objects";
import { loadTemplatesForTemplateCategories } from "../template/template.repository";

const TemplateCategoryObjectRef =
    schemaBuilder.objectRef<TemplateCategory>("TemplateCategory");

export const TemplateCategoryObject = schemaBuilder.loadableObject<
    TemplateCategory | Error, // LoadResult
    number, // Key
    [], // Interfaces
    typeof TemplateCategoryObjectRef // NameOrRef
>(TemplateCategoryObjectRef, {
    load: async (ids: number[]) => await loadTemplateCategoriesByIds(ids),
    sort: c => c.id,
    fields: (t) => ({
        id: t.exposeInt("id"),
        name: t.exposeString("name"),
        description: t.exposeString("description", { nullable: true }),
        order: t.exposeInt("order", { nullable: true }),
        specialType: t.exposeString("specialType", { nullable: true }),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
        // relations
        // parentCategory: TemplateCategory | null;
        // subCategories: TemplateCategory[];
    }),
});

schemaBuilder.objectFields(TemplateCategoryObject, (t) => ({
    templates: t.loadableList({
        type: TemplateObject,
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
