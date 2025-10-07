import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as TmvPothos from "./templateVariable.pothos";
import * as TmvRepo from "./templateVariable.repository";

gqlSchemaBuilder.queryFields((t) => ({
    templateVariable: t.field({
        type: TmvPothos.TemplateVariablePothosInterface,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_parent, { id }) => {
            return await TmvRepo.findTemplateVariableById(id);
        },
    }),

    templateVariablesByTemplateId: t.field({
        type: [TmvPothos.TemplateVariablePothosInterface],
        args: {
            templateId: t.arg.int({ required: true }),
        },
        resolve: async (_parent, args) =>
            await TmvRepo.findTemplateVariablesByTemplateId(args.templateId),
    }),
}));
