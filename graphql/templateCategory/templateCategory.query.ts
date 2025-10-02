import { schemaBuilder } from "../builder";
import { TemplateCategoryObject } from "./templateCategory.objects";
import {
    findAllTemplateCategories,
    findMainTemplateCategory,
    findSuspensionTemplateCategory,
    findTemplateCategoryById,
} from "./templateCategory.repository";

schemaBuilder.queryFields((t) => ({
    templateCategory: t.field({
        type: TemplateCategoryObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) => findTemplateCategoryById(args.id),
    }),

    templateCategories: t.field({
        type: [TemplateCategoryObject],
        resolve: async () => findAllTemplateCategories(),
    }),

    mainTemplateCategory: t.field({
        type: TemplateCategoryObject,
        resolve: async () => findMainTemplateCategory(),
    }),

    suspensionTemplateCategory: t.field({
        type: TemplateCategoryObject,
        resolve: async () => findSuspensionTemplateCategory(),
    }),
}));
