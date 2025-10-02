import { schemaBuilder } from "../builder";
import {
    TemplateCreateInputPothosObject,
    TemplatePothosObject,
    TemplateUpdateInputPothosObject,
} from "./template.objects";
import {
    createTemplate,
    updateTemplate,
    deleteTemplateById,
    suspendTemplateById,
    unsuspendTemplateById,
} from "./template.repository";

schemaBuilder.mutationFields((t) => ({
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
