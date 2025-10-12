import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { PaginationArgs } from "@/server/types";
import {
  PaginatedTemplatesResponsePothosObject,
  TemplatePothosObject,
  TemplatesConfigsPothosObject,
  PaginationArgsObject,
} from "@/server/graphql/pothos";
import { TemplateRepository } from "@/server/db/repo";

gqlSchemaBuilder.queryFields((t) => ({
  template: t.field({
    type: TemplatePothosObject,
    nullable: true,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_query, args) => await TemplateRepository.findById(args.id),
  }),

  templates: t.field({
    type: PaginatedTemplatesResponsePothosObject,
    args: {
      pagination: t.arg({
        type: PaginationArgsObject,
      }),
    },
    resolve: async (_, args) =>
      await TemplateRepository.findAllPaginated(
        new PaginationArgs({ ...args.pagination }),
      ),
  }),

  templatesByCategoryId: t.field({
    type: [TemplatePothosObject],
    args: {
      categoryId: t.arg.int({ required: true }),
    },
    resolve: async (_, args) =>
      await TemplateRepository.findByCategoryId(args.categoryId),
  }),

  suspendedTemplates: t.field({
    type: [TemplatePothosObject],
    resolve: async () => await TemplateRepository.suspendedTemplates(),
  }),

  templatesConfigs: t.field({
    type: TemplatesConfigsPothosObject,
    resolve: async () => {
      const conf = await TemplateRepository.allConfigs();
      return {
        configs: conf,
      };
    },
  }),
}));
