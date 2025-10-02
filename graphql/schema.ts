import "@/graphql/template/template.query";
import "@/graphql/template/template.mutation";

import "@/graphql/templateCategory/templateCategory.query";

import { schemaBuilder } from "./builder";

import { DateResolver, DateTimeResolver } from "graphql-scalars";

schemaBuilder.addScalarType("Date", DateResolver, {});
schemaBuilder.addScalarType("DateTime", DateTimeResolver, {});

schemaBuilder.mutationType({});

schemaBuilder.queryType({});

export const graphQLSchema = schemaBuilder.toSchema();
