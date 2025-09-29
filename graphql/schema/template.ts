import {
    resolveCursorConnection,
    ResolveCursorConnectionArgs,
} from "@pothos/plugin-relay";
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
        resolve: (_, args) =>
            resolveCursorConnection(
                {
                    args,
                    toCursor: (template) => template.createdAt.toISOString(),
                },
                // Manually defining the arg type here is required
                // so that typescript can correctly infer the return value
                ({
                    before,
                    after,
                    limit,
                    inverted,
                }: ResolveCursorConnectionArgs) =>
                    prismaClient.template.findMany({
                        take: limit,
                        where: {
                            createdAt: {
                                lt: before,
                                gt: after,
                            },
                        },
                        orderBy: {
                            createdAt: inverted ? "desc" : "asc",
                        },
                    }),
            ),
    }),
}));
