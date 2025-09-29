import { resolveOffsetConnection } from "@pothos/plugin-relay";
import prismaClient from "@/prisma/prismaClient";
import schemaBuilder from "./builder";

// Define the Template object type
const Template = schemaBuilder.prismaObject("Template", {
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

// // Add template queries to the Query type
schemaBuilder.queryFields((t) => ({
    template: t.prismaField({
        type: "Template",
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (query, _parent, args) => {
            return await prismaClient.template.findUnique({
                ...query,
                where: { id: args.id },
            });
        },
    }),

    templates: t.connection({
        type: Template,
        resolve: async (args) => {
            // Get total count for proper pagination support
            const totalCount = await prismaClient.template.count();

            return resolveOffsetConnection(
                {
                    args,
                    defaultSize: 20, // Default page size
                    maxSize: 100, // Maximum allowed page size
                    totalCount, // Required to support `last` without `before`
                },
                ({ limit, offset }) => {
                    return prismaClient.template.findMany({
                        skip: offset,
                        take: limit,
                        orderBy: {
                            createdAt: "desc",
                        },
                    });
                },
            );
        },
    }),
}));
