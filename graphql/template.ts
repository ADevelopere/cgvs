import { schemaBuilder } from "./builder";
import { db } from "@/db/db";
import {
    PaginationArgs,
    PaginationArgsDefault,
    PaginationInfo,
} from "./pagination";
import { templates } from "@/db/schema";
import { count } from "drizzle-orm";

// Define the Template object type
export const Template = schemaBuilder.drizzleObject("templates", {
    name: "Template",
    select: {
        columns: {
            id: true,
        },
    },
    fields: (t) => ({
        id: t.exposeID("id"),
        name: t.exposeString("name"),
        // imageUrl: t.string({
        //     nullable: true,
        //     resolve: async (template) => {
        //         // If there's an imageFileId, fetch the file path/URL
        //         if (template.imageFileId) {
        //             const file = await prismaClient.storageFile.findUnique({
        //                 where: { id: template.imageFileId },
        //             });
        //             return file?.path || null;
        //         }
        //         return null;
        //     },
        // }),
        createdAt: t.expose("createdAt", { type: "DateTime" }),
        updatedAt: t.expose("updatedAt", { type: "DateTime" }),
        // category: t.relation("category"),
        // templateVariables: t.relation("templateVariables"),
        // elements: t.relation("elements"),
    }),
});

const PaginatedTemplatesResponse = schemaBuilder.simpleObject(
    "PaginatedTemplatesResponse",
    {
        fields: (t) => ({
            data: t.field({ type: [Template] }),
            paginationInfo: t.field({ type: PaginationInfo, nullable: true }),
        }),
    },
);

// // Add template queries to the Query type
schemaBuilder.queryFields((t) => ({
    template: t.drizzleField({
        type: "templates",
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (query, _parent, args) => {
            return await db.query.templates.findFirst({
                ...query,
                where: { id: args.id },
            });
        },
    }),
}));

schemaBuilder.queryField("templates", (t) =>
    t.field({
        type: PaginatedTemplatesResponse,
        args: {
            pagination: t.arg({
                type: PaginationArgs,
            }),
        },
        resolve: async (_, args) => {
            const { first, skip, page, maxCount } = args.pagination ?? {};

            // Count total
            const [{ value: total }] = await db
                .select({ value: count() })
                .from(templates);

            // Figure out pagination
            const perPage = Math.min(
                first ?? PaginationArgsDefault.first,
                maxCount ?? PaginationArgsDefault.maxCount,
            );
            const currentPage =
                page ?? (skip ? Math.floor(skip / perPage) + 1 : 1);
            const offset = (currentPage - 1) * perPage;

            // Query data
            const data = await db.query.templates.findMany({
                orderBy: (templates, { desc }) => [desc(templates.createdAt)],
                limit: perPage,
                offset,
            });

            const length = data.length;
            const lastPage = Math.ceil(total / perPage);
            const firstItem = offset + 1;
            const lastItem = offset + length;
            const hasMorePages = currentPage < lastPage;

            return {
                data,
                paginationInfo: {
                    count: length,
                    currentPage,
                    firstItem: length > 0 ? firstItem : null,
                    lastItem: length > 0 ? lastItem : null,
                    hasMorePages,
                    lastPage,
                    perPage,
                    total,
                },
            };
        },
    }),
);
