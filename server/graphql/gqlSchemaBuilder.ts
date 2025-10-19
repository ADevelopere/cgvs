import SchemaBuilder from "@pothos/core";
import AddGraphQL from "@pothos/plugin-add-graphql";
import ErrorsPlugin from "@pothos/plugin-errors";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import WithInputPlugin from "@pothos/plugin-with-input";
import DataloaderPlugin from "@pothos/plugin-dataloader";
import DrizzlePlugin from "@pothos/plugin-drizzle";
import { type DrizzleRelations, db, relations } from "@/server/db/drizzleDb";
import SimpleObjectsPlugin from "@pothos/plugin-simple-objects";
import { getTableConfig } from "drizzle-orm/pg-core";
import logger from "@/lib/logger";
import { AuthContexts, BaseContext } from "./gqlContext";
import { PhoneNumber, Email } from "../lib";
import TracingPlugin, {
  wrapResolver,
  isRootField,
} from "@pothos/plugin-tracing";

export interface PothosTypes {
  DrizzleRelations: DrizzleRelations;
  Context: BaseContext;
  AuthScopes: {
    loggedIn: boolean;
    admin: boolean;
    role: string;
  };
  AuthContexts: AuthContexts;
  Scalars: {
    DateTime: { Input: Date; Output: Date | string };
    Date: { Input: Date; Output: Date };
    // use following scalars for input types only for automatic validation
    PhoneNumber: { Input: PhoneNumber; Output: PhoneNumber };
    Email: { Input: Email; Output: Email };
  };
}

export const gqlSchemaBuilder = new SchemaBuilder<PothosTypes>({
  plugins: [
    DrizzlePlugin,
    AddGraphQL,
    ErrorsPlugin,
    ScopeAuthPlugin,
    WithInputPlugin,
    SimpleObjectsPlugin,
    DataloaderPlugin,
    TracingPlugin,
  ],
  drizzle: {
    client: () => db,
    getTableConfig,
    relations,
  },
  scopeAuth: {
    authScopes: ctx => ({
      loggedIn: !!ctx.user,
      admin: !!ctx.roles.includes("admin"),
      role: (role: string) => ctx.roles.includes(role),
    }),
  },
  errors: {
    defaultTypes: [],
    onResolvedError: error => logger.error("Handled error:", error),
  },
  tracing: {
    // Enable tracing for rootFields by default, other fields need to opt in
    default: config => isRootField(config),
    // Log resolver execution duration
    wrap: (resolver, options, config) =>
      wrapResolver(resolver, (error, duration) => {
        logger.log(
          `Executed resolver ${config.parentType}.${config.name} in ${duration}ms`
        );
      }),
  },
});
