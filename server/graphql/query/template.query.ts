import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { PaginationArgs } from "@/server/types";
import {
    PaginatedTemplatesResponsePothosObject,
    TemplatePothosObject,
    TemplatesConfigsPothosObject,
    PaginationArgsObject
} from "@/server/graphql/pothos";
import { TemplateRepository } from "@/server/db/repo";

gqlSchemaBuilder.queryFields((t) => ({
    template: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) => TemplateRepository.findById(args.id),
    }),

    templates: t.field({
        type: PaginatedTemplatesResponsePothosObject,
        args: {
            pagination: t.arg({
                type: PaginationArgsObject,
            }),
        },
        resolve: async (_, args) =>
            TemplateRepository.findAllPaginated(
                new PaginationArgs({ ...args.pagination }),
            ),
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
