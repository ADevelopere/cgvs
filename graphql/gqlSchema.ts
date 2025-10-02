import "@/graphql/auth/auth.query";
import "@/graphql/auth/auth.mutation";

import "@/graphql/template/template.query";
import "@/graphql/template/template.mutation";

import "@/graphql/templateCategory/templateCategory.query";
import "@/graphql/templateCategory/templateCategory.mutation";

import { gqlSchemaBuilder } from "./gqlSchemaBuilder";

import { DateResolver, DateTimeResolver } from "graphql-scalars";

gqlSchemaBuilder.addScalarType("Date", DateResolver, {});
gqlSchemaBuilder.addScalarType("DateTime", DateTimeResolver, {});

gqlSchemaBuilder.mutationType({});

gqlSchemaBuilder.queryType({});

export const graphQLSchema = gqlSchemaBuilder.toSchema();
