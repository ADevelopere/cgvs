import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { PaginationArgsObject } from "../pagintaion/pagination.objects";
import { PaginationArgs } from "../pagintaion/pagintaion.types";
import {
    PaginatedTemplatesResponsePothosObject,
    TemplatePothosObject,
    TemplatesConfigsPothosObject,
} from "./template.pothos";
import { TemplateRepository } from "./template.repository";

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
