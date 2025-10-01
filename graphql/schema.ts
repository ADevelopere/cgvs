import "./template";
import "./templateCategory";
import { schemaBuilder } from "./builder";

import { DateResolver, DateTimeResolver } from "graphql-scalars";

schemaBuilder.addScalarType("Date", DateResolver, {});
schemaBuilder.addScalarType("DateTime", DateTimeResolver, {});

schemaBuilder.mutationType({});

schemaBuilder.queryType({});

export const graphQLSchema = schemaBuilder.toSchema();
