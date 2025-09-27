import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaTypes from "../generated/pothos-types";
import PrismaUtils from "@pothos/plugin-prisma-utils";
import prismaClient from "@/prisma/client";

// This is the default location for the generator, but this can be
// customized as described above.
// Using a type only import will help avoid issues with undeclared
// exports in esm mode

const builder = new SchemaBuilder<{
    PrismaTypes: PrismaTypes;
}>({
    plugins: [PrismaPlugin, PrismaUtils],
    prisma: {
        client: prismaClient,
        filterConnectionTotalCount: true,
        onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
    },
});

// Add root Query type
builder.queryType({
    fields: (t) => ({
        hello: t.string({
            resolve: () => "Hello, world!",
        }),
    }),
});

export const schema = builder.toSchema();
