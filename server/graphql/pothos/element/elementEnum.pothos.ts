import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";

export const ElementTypePothosEnum = gqlSchemaBuilder.enumType("ElementType", {
  values: Object.values(Types.ElementType),
});

export const ElementAlignmentPothosEnum = gqlSchemaBuilder.enumType(
  "ElementAlignment",
  {
    values: Object.values(Types.ElementAlignment),
  }
);

export const ElementOverflowPothosEnum = gqlSchemaBuilder.enumType(
  "ElementOverflow",
  {
    values: Object.values(Types.ElementOverflow),
  }
);
