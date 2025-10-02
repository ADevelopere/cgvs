import { schemaBuilder } from "../builder";
import {
    TemplateCreateInputObject,
    TemplateObject,
    TemplateUpdateInputObject,
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
        type: TemplateObject,
        args: {
            input: t.arg({ type: TemplateCreateInputObject, required: true }),
        },
        resolve: async (_, args) => createTemplate(args.input),
    }),

    updateTemplate: t.field({
        type: TemplateObject,
        nullable: true,
        args: {
            input: t.arg({ type: TemplateUpdateInputObject, required: true }),
        },
        resolve: async (_, args) => updateTemplate(args.input),
    }),

    deleteTemplate: t.field({
        type: TemplateObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => deleteTemplateById(args.id),
    }),

    suspendTemplate: t.field({
        type: TemplateObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => suspendTemplateById(args.id),
    }),

    unsuspendTemplate: t.field({
        type: TemplateObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => unsuspendTemplateById(args.id),
    }),
}));
