import "@/server/graphql/auth/auth.query";
import "@/server/graphql/auth/auth.mutation";

import "@/server/graphql/template/template.query";
import "@/server/graphql/template/template.mutation";

import "@/server/graphql/templateCategory/templateCategory.query";
import "@/server/graphql/templateCategory/templateCategory.mutation";

import { gqlSchemaBuilder } from "./gqlSchemaBuilder";

import { DateResolver, DateTimeResolver } from "graphql-scalars";

gqlSchemaBuilder.addScalarType("Date", DateResolver, {});
gqlSchemaBuilder.addScalarType("DateTime", DateTimeResolver, {});

gqlSchemaBuilder.mutationType({});

gqlSchemaBuilder.queryType({});

export const graphQLSchema = gqlSchemaBuilder.toSchema();
