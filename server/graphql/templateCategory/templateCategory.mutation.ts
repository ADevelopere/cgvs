import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    TemplateCategoryCreateInputObject as TemplateCategoryCreateInputPothosObject,
    TemplateCategoryPothosObject,
    TemplateCategoryUpdateInputPothosObject,
} from "./templateCategory.pothos";
import { TemplateCategoryRepository } from "./templateCategory.repository";

gqlSchemaBuilder.mutationFields((t) => ({
    createTemplateCategory: t.field({
        type: TemplateCategoryPothosObject,
        args: {
            input: t.arg({
                type: TemplateCategoryCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            TemplateCategoryRepository.create(args.input),
    }),

    updateTemplateCategory: t.field({
        type: TemplateCategoryPothosObject,
        args: {
            input: t.arg({
                type: TemplateCategoryUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            TemplateCategoryRepository.update(args.input),
    }),

    deleteTemplateCategory: t.field({
        type: TemplateCategoryPothosObject,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) =>
            TemplateCategoryRepository.deleteById(args.id),
    }),
}));
