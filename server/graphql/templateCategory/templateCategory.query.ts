import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplateCategoryPothosObject } from "./templateCategory.pothos";
import {
     TemplateCategoryRepository
} from "./templateCategory.repository";

gqlSchemaBuilder.queryFields((t) => ({
    templateCategory: t.field({
        type: TemplateCategoryPothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) =>  TemplateCategoryRepository.findById(args.id),
    }),

    templateCategories: t.field({
        type: [TemplateCategoryPothosObject],
        resolve: async () =>  TemplateCategoryRepository.findAll(),
    }),

    mainTemplateCategory: t.field({
        type: TemplateCategoryPothosObject,
        resolve: async () =>  TemplateCategoryRepository.findTemplatesMainCategory(),
    }),

    suspensionTemplateCategory: t.field({
        type: TemplateCategoryPothosObject,
        resolve: async () =>  TemplateCategoryRepository.findTemplatesSuspensionCategory(),
    }),
}));
