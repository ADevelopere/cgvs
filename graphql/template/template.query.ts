import { schemaBuilder } from "../builder";
import {
    PaginationArgsObject,
} from "../pagintaion/pagination.objects";
import {
    PaginatedTemplatesResponsePothosObject,
    TemplatePothosObject,
} from "./template.objects";
import {
    findTemplateByIdOrThrow,
    findTemplatesPaginated,
} from "./template.repository";

schemaBuilder.queryFields((t) => ({
    template: t.field({
        type: TemplatePothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) => findTemplateByIdOrThrow(args.id),
    }),

    templates: t.field({
        type: PaginatedTemplatesResponsePothosObject,
        args: {
            pagination: t.arg({
                type: PaginationArgsObject,
            }),
        },
        resolve: async (_, args) => findTemplatesPaginated(args.pagination),
    }),
}));
