import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as TmvPothos from "./templateVariable.pothos";
import { TemplateVariableRepository as TmvRepo } from "./templateVariable.repository";

gqlSchemaBuilder.queryFields((t) => ({
    templateVariable: t.field({
        type: TmvPothos.TemplateVariablePothosInterface,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_parent, { id }) => {
            return await TmvRepo.findById(id);
        },
    }),

    templateVariablesByTemplateId: t.field({
        type: [TmvPothos.TemplateVariablePothosInterface],
        args: {
            templateId: t.arg.int({ required: true }),
        },
        resolve: async (_parent, args) =>
            await TmvRepo.findByTemplateId(args.templateId),
    }),
}));
