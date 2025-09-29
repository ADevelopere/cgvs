import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import PrismaUtils from "@pothos/plugin-prisma-utils";
import type PrismaTypes from "@/prisma/generated/pothos-types";
import prismaClient from "@/prisma/prismaClient";
import RelayPlugin from "@pothos/plugin-relay";
import ErrorsPlugin from "@pothos/plugin-errors";

import { DateResolver, DateTimeResolver } from "graphql-scalars";
import logger from "@/utils/logger";

// This is the default location for the generator, but this can be
// customized as described above.
// Using a type only import will help avoid issues with undeclared
// exports in esm mode

const schemaBuilder = new SchemaBuilder<{
    PrismaTypes: PrismaTypes;
    Scalars: {
        Date: {
            Input: Date;
            Output: Date;
        };
        DateTime: {
            Input: Date;
            Output: Date;
        };
    };
}>({
    plugins: [PrismaPlugin, RelayPlugin, PrismaUtils, ErrorsPlugin],
    prisma: {
        client: prismaClient,
        filterConnectionTotalCount: true,
        onUnusedQuery: process.env.NODE_ENV === "production" ? null : "warn",
    },
    relay: {
        clientMutationId: "omit",
        cursorType: "String",
    },
    errors: {
        defaultTypes: [],
        onResolvedError: (error) => logger.error("Handled error:", error),
    },
});

schemaBuilder.addScalarType("Date", DateResolver, {});
schemaBuilder.addScalarType("DateTime", DateTimeResolver, {});

schemaBuilder.queryType({
});


export default schemaBuilder;
