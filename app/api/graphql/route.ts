import { graphQLSchema } from "@/graphql/server/gqlSchema";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { createGraphQLContext } from "@/graphql/server/gqlContextFactory";

const server = new ApolloServer({
    schema: graphQLSchema,
});

const handler = startServerAndCreateNextHandler(server, {
    context: createGraphQLContext,
});

export { handler as GET, handler as POST };
