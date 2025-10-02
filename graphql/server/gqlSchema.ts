import "@/graphql/server/auth/auth.query";
import "@/graphql/server/auth/auth.mutation";

import "@/graphql/server/template/template.query";
import "@/graphql/server/template/template.mutation";

import "@/graphql/server/templateCategory/templateCategory.query";
import "@/graphql/server/templateCategory/templateCategory.mutation";

import { gqlSchemaBuilder } from "./gqlSchemaBuilder";

import { DateResolver, DateTimeResolver } from "graphql-scalars";

gqlSchemaBuilder.addScalarType("Date", DateResolver, {});
gqlSchemaBuilder.addScalarType("DateTime", DateTimeResolver, {});

gqlSchemaBuilder.mutationType({});

gqlSchemaBuilder.queryType({});

export const graphQLSchema = gqlSchemaBuilder.toSchema();
