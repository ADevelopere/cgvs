import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    TemplateCreateInputPothosObject,
    TemplatePothosObject,
    TemplateUpdateInputPothosObject,
} from "../pothos/";
import { TemplateRepository } from "@/server/db/repo";

gqlSchemaBuilder.mutationFields((t) => ({
    createTemplate: t.field({
        type: TemplatePothosObject,
        args: {
            input: t.arg({
                type: TemplateCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => TemplateRepository.create(args.input),
    }),

    updateTemplate: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            input: t.arg({
                type: TemplateUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => TemplateRepository.update(args.input),
    }),

    deleteTemplate: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => TemplateRepository.deleteById(args.id),
    }),

    suspendTemplate: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => TemplateRepository.suspendById(args.id),
    }),

    unsuspendTemplate: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => TemplateRepository.unsuspendById(args.id),
    }),
}));
