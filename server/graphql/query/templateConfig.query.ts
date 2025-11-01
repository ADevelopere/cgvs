import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplateConfigRepository } from "@/server/db/repo";
import * as Pothos from "@/server/graphql/pothos";

gqlSchemaBuilder.queryFields(t => ({
  templateConfig: t.field({
    type: Pothos.TemplateConfigPothosObject,
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_query, args) =>
      await TemplateConfigRepository.findById(args.id),
  }),

  templateConfigByTemplateId: t.field({
    type: Pothos.TemplateConfigPothosObject,
    nullable: true,
    args: {
      templateId: t.arg.int({ required: true }),
    },
    resolve: async (_query, args) =>
      await TemplateConfigRepository.findByTemplateId(args.templateId),
  }),
}));
