import { schemaBuilder } from "../builder";
import {
    PaginationArgsObject,
} from "../pagintaion/pagination.objects";
import {
    PaginatedTemplatesResponseObject,
    TemplateObject,
} from "./template.objects";
import {
    findTemplateByIdOrThrow,
    findTemplatesPaginated,
} from "./template.repository";

schemaBuilder.queryFields((t) => ({
    template: t.field({
        type: TemplateObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_query, args) => findTemplateByIdOrThrow(args.id),
    }),

    templates: t.field({
        type: PaginatedTemplatesResponseObject,
        args: {
            pagination: t.arg({
                type: PaginationArgsObject,
            }),
        },
        resolve: async (_, args) => findTemplatesPaginated(args.pagination),
    }),
}));
