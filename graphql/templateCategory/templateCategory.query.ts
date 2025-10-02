import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplateCategoryPothosObject } from "./templateCategory.pothos";
import {
    findAllTemplateCategories,
    findMainTemplateCategory,
    findSuspensionTemplateCategory,
    findTemplateCategoryById,
} from "./templateCategory.repository";

gqlSchemaBuilder.queryFields((t) => ({
    templateCategory: t.field({
        type: TemplateCategoryPothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) => findTemplateCategoryById(args.id),
    }),

    templateCategories: t.field({
        type: [TemplateCategoryPothosObject],
        resolve: async () => findAllTemplateCategories(),
    }),

    mainTemplateCategory: t.field({
        type: TemplateCategoryPothosObject,
        resolve: async () => findMainTemplateCategory(),
    }),

    suspensionTemplateCategory: t.field({
        type: TemplateCategoryPothosObject,
        resolve: async () => findSuspensionTemplateCategory(),
    }),
}));
