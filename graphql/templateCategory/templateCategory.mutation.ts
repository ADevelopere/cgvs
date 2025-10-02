import { schemaBuilder } from "../builder";
import {
    TemplateCategoryCreateInputObject as TemplateCategoryCreateInputPothosObject,
    TemplateCategoryObject,
    TemplateCategoryUpdateInputPothosObject,
} from "./templateCategory.objects";
import {
    createTemplateCategory,
    deleteTemplateCategoryById,
    updateTemplateCategory,
} from "./templateCategory.repository";

schemaBuilder.mutationFields((t) => ({
    createTemplateCategory: t.field({
        type: TemplateCategoryObject,
        args: {
            input: t.arg({
                type: TemplateCategoryCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => createTemplateCategory(args.input),
    }),

    updateTemplateCategory: t.field({
        type: TemplateCategoryObject,
        args: {
            input: t.arg({
                type: TemplateCategoryUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => updateTemplateCategory(args.input),
    }),

    deleteTemplateCategory: t.field({
        type: TemplateCategoryObject,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => deleteTemplateCategoryById(args.id),
    }),
}));
