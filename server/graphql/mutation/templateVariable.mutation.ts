import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as TmvPothos from "../pothos";
import { TemplateVariableRepository as TmvRepo } from "@/server/db/repo";

gqlSchemaBuilder.mutationFields((t) => ({
    createTemplateTextVariable: t.field({
        type: TmvPothos.TemplateTextVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateTextVariableCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => await TmvRepo.createTextVar(args.input),
    }),
    createTemplateNumberVariable: t.field({
        type: TmvPothos.TemplateNumberVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateNumberVariableCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => await TmvRepo.createNumberVar(args.input),
    }),
    createTemplateDateVariable: t.field({
        type: TmvPothos.TemplateDateVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateDateVariableCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => await TmvRepo.createDateVar(args.input),
    }),
    createTemplateSelectVariable: t.field({
        type: TmvPothos.TemplateSelectVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateSelectVariableCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => await TmvRepo.createSelectVar(args.input),
    }),

    updateTemplateTextVariable: t.field({
        type: TmvPothos.TemplateTextVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateTextVariableUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => await TmvRepo.updateTextVar(args.input),
    }),
    updateTemplateNumberVariable: t.field({
        type: TmvPothos.TemplateNumberVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateNumberVariableUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => await TmvRepo.updateNumberVar(args.input),
    }),
    updateTemplateDateVariable: t.field({
        type: TmvPothos.TemplateDateVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateDateVariableUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => await TmvRepo.updateDateVar(args.input),
    }),
    updateTemplateSelectVariable: t.field({
        type: TmvPothos.TemplateSelectVariablePothosObjectType,
        args: {
            input: t.arg({
                type: TmvPothos.TemplateSelectVariableUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => await TmvRepo.updateSelectVar(args.input),
    }),

    deleteTemplateVariable: t.field({
        type: TmvPothos.TemplateVariablePothosInterface,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => await TmvRepo.deleteVarById(args.id),
    }),
}));
