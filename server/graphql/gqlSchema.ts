import "@/server/graphql/auth";
import "@/server/graphql/template";
import "@/server/graphql/templateCategory";
import "@/server/graphql/templateVariable";
import "@/server/graphql/recipientGroup";

import "@/server/graphql/storage";

import "@/server/graphql/student";

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
