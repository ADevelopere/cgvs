import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplateVariableRepository as TempVarRepo } from "@/server/db/repo";
import * as Pothos from "@/server/graphql/pothos";

gqlSchemaBuilder.queryFields(t => ({
  templateVariable: t.field({
    type: Pothos.TemplateVariablePothosInterface,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, { id }) => {
      return await TempVarRepo.findById(id);
    },
  }),

  templateVariablesByTemplateId: t.field({
    type: [Pothos.TemplateVariablePothosInterface],
    args: {
      templateId: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) =>
      await TempVarRepo.findByTemplateId(args.templateId),
  }),
}));
