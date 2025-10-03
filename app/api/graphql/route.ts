import { graphQLSchema } from "@/server/graphql/gqlSchema";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { createGraphQLContext } from "@/server/graphql/gqlContextFactory";

const server = new ApolloServer({
    schema: graphQLSchema,
});

const handler = startServerAndCreateNextHandler(server, {
    context: createGraphQLContext,
});

// Lightweight HEAD handler: return 204 No Content so health/connectivity checks
// (which use HEAD) succeed quickly without invoking the full Apollo handler.
export async function HEAD() {
    return new Response(null, { status: 204 });
}

export { handler as GET, handler as POST };
