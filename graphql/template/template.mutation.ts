import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    TemplateCreateInputPothosObject,
    TemplatePothosObject,
    TemplateUpdateInputPothosObject,
} from "./template.pothos";
import {
    createTemplate,
    updateTemplate,
    deleteTemplateById,
    suspendTemplateById,
    unsuspendTemplateById,
} from "./template.repository";

gqlSchemaBuilder.mutationFields((t) => ({
    createTemplate: t.field({
        type: TemplatePothosObject,
        args: {
            input: t.arg({ type: TemplateCreateInputPothosObject, required: true }),
        },
        resolve: async (_, args) => createTemplate(args.input),
    }),

    updateTemplate: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            input: t.arg({ type: TemplateUpdateInputPothosObject, required: true }),
        },
        resolve: async (_, args) => updateTemplate(args.input),
    }),

    deleteTemplate: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => deleteTemplateById(args.id),
    }),

    suspendTemplate: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => suspendTemplateById(args.id),
    }),

    unsuspendTemplate: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => unsuspendTemplateById(args.id),
    }),
}));
