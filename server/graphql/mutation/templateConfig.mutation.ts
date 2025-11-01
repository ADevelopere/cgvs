import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplateConfigRepository } from "@/server/db/repo";
import * as Pothos from "@/server/graphql/pothos";

gqlSchemaBuilder.mutationFields(t => ({
  createTemplateConfig: t.field({
    type: Pothos.TemplateConfigPothosObject,
    args: {
      input: t.arg({
        type: Pothos.TemplateConfigCreateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_query, args) => {
      const { input } = args;
      return await TemplateConfigRepository.create(input);
    },
  }),

  updateTemplateConfig: t.field({
    type: Pothos.TemplateConfigPothosObject,
    args: {
      input: t.arg({
        type: Pothos.TemplateConfigUpdateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_query, args) => {
      const { input } = args;
      return await TemplateConfigRepository.update(input);
    },
  }),
}));
