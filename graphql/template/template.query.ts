import { schemaBuilder } from "../builder";
import {
    PaginationArgsDefault,
    PaginationArgsObject,
} from "../pagintaion/pagination.objects";
import {
    PaginatedTemplatesResponseObject,
    TemplateObject,
} from "./template.objects";
import {
    findTemplateByIdOrThrow,
    findTemplates,
    templatesTotalCount,
} from "./template.repository";
import { PaginatedTemplatesResponse } from "./template.types";

schemaBuilder.queryFields((t) => ({
    template: t.fieldWithInput({
        type: TemplateObject,
        nullable: true,
        input: {
            id: t.input.int({ required: true }),
        },
        resolve: async (_query, input) =>
            findTemplateByIdOrThrow(input.input.id),
    }),

    templates: t.field({
        type: PaginatedTemplatesResponseObject,
        args: {
            pagination: t.arg({
                type: PaginationArgsObject,
            }),
        },
        resolve: async (_, args) => {
            const { first, skip, page, maxCount } = args.pagination ?? {};

            // Count total
            const total = await templatesTotalCount();

            // Figure out pagination
            const perPage = Math.min(
                first ?? PaginationArgsDefault.first,
                maxCount ?? PaginationArgsDefault.maxCount,
            );
            const currentPage =
                page ?? (skip ? Math.floor(skip / perPage) + 1 : 1);
            const offset = (currentPage - 1) * perPage;

            const templates = await findTemplates({
                limit: perPage,
                offset,
            });

            const length = templates.length;
            const lastPage = Math.ceil(total / perPage);
            const hasMorePages = currentPage < lastPage;

            const result: PaginatedTemplatesResponse = {
                data: templates,
                pageInfo: {
                    count: length,
                    currentPage,
                    firstItem: length > 0 ? offset + 1 : null,
                    lastItem: length > 0 ? offset + length : null,
                    hasMorePages,
                    lastPage,
                    perPage,
                    total,
                },
            };

            return result;
        },
    }),
}));
