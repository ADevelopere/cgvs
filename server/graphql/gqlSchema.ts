import "@/server/graphql/auth/auth.query";
import "@/server/graphql/auth/auth.mutation";

import "@/server/graphql/template/template.query";
import "@/server/graphql/template/template.mutation";

import "@/server/graphql/templateCategory/templateCategory.query";
import "@/server/graphql/templateCategory/templateCategory.mutation";

import "@/server/graphql/storage/storage.query";
import "@/server/graphql/storage/storage.mutation";

import { gqlSchemaBuilder } from "./gqlSchemaBuilder";

import { DateResolver, DateTimeResolver } from "graphql-scalars";
import { PhoneNumberScalar } from "./scalars/phoneNumberScalar";
import { EmailScalar } from "./scalars/emailScalar";

gqlSchemaBuilder.addScalarType("Date", DateResolver, {});
gqlSchemaBuilder.addScalarType("DateTime", DateTimeResolver, {});
gqlSchemaBuilder.addScalarType("PhoneNumber", PhoneNumberScalar);
gqlSchemaBuilder.addScalarType("Email", EmailScalar);

gqlSchemaBuilder.mutationType({});

gqlSchemaBuilder.queryType({});

export const graphQLSchema = gqlSchemaBuilder.toSchema();
