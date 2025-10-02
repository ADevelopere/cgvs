import { schemaBuilder } from "../builder";
import { TemplateCategory } from "./templateCategory.types";
import { loadTemplateCategoriesByIds } from "./templateCategory.repository";
import { TemplateObject } from "../template/template.objects";
import { loadTemplatesForTemplateCategory } from "../template/template.repository";

const TemplateCategoryObjectRef =
    schemaBuilder.objectRef<TemplateCategory>("TemplateCategory");

export const TemplateCategoryObject = schemaBuilder.loadableObject<
    TemplateCategory | Error, // LoadResult
    number, // Key
    [], // Interfaces
    typeof TemplateCategoryObjectRef // NameOrRef
>(TemplateCategoryObjectRef, {
    load: async (ids: number[]) => loadTemplateCategoriesByIds(ids),
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
    templates: t.field({
        type: [TemplateObject],
        resolve: (templateCategory) => {
            return loadTemplatesForTemplateCategory(templateCategory.id);
        },
    }),
}));
