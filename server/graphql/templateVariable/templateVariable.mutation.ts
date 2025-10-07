import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as TmvPothos from "./templateVariable.pothos";
import * as TmvRepo from "./templateVariable.repository";

gqlSchemaBuilder.mutationFields((t) => ({
    createTemplateTextVariable: t.field({
        type: TmvPothos.TemplateTextVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateTextVariableCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            await TmvRepo.createTemplateTextVariable(args.input),
    }),
    createTemplateNumberVariable: t.field({
        type: TmvPothos.TemplateNumberVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateNumberVariableCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            await TmvRepo.createTemplateNumberVariable(args.input),
    }),
    createTemplateDateVariable: t.field({
        type: TmvPothos.TemplateDateVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateDateVariableCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            await TmvRepo.createTemplateDateVariable(args.input),
    }),
    createTemplateSelectVariable: t.field({
        type: TmvPothos.TemplateSelectVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateSelectVariableCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            await TmvRepo.createTemplateSelectVariable(args.input),
    }),

    updateTemplateTextVariable: t.field({
        type: TmvPothos.TemplateTextVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateTextVariableUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            await TmvRepo.updateTemplateTextVariable(args.input),
    }),
    updateTemplateNumberVariable: t.field({
        type: TmvPothos.TemplateNumberVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateNumberVariableUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            await TmvRepo.updateTemplateNumberVariable(args.input),
    }),
    updateTemplateDateVariable: t.field({
        type: TmvPothos.TemplateDateVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateDateVariableUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            await TmvRepo.updateTemplateDateVariable(args.input),
    }),
    updateTemplateSelectVariable: t.field({
        type: TmvPothos.TemplateSelectVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateSelectVariableUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            await TmvRepo.updateTemplateSelectVariable(args.input),
    }),

    deleteTemplateVariable: t.field({
        type: TmvPothos.TemplateVariablePothosInterface,
        args: {
            id: t.arg.int({required: true})
        },
        resolve: async (_, args) => await TmvRepo.deleteTemplateVariableById(args.id)
    })
}));
