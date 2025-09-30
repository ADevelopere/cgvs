import { graphQLSchema } from "@/graphql/schema";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const server = new ApolloServer({
    schema: graphQLSchema,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
