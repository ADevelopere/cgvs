
import "reflect-metadata";
import "core-js/features/reflect";
import { buildSchema } from "type-graphql";

import { TemplateCrudResolver } from "@/graphql/generated/type-graphql/resolvers/crud/Template/TemplateCrudResolver";

const schema = await buildSchema({
  resolvers: [TemplateCrudResolver],
});

export default schema;