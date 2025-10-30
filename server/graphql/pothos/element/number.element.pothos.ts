import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { NumberElementRepository } from "@/server/db/repo/element";
import {
  TextPropsObject,
  TextPropsInputObject,
  TextPropsUpdateInputObject,
  CertificateElementPothosInterface,
  createBaseElementInputFields,
  createBaseElementUpdateInputFields,
} from "./base.element.pothos";

// ============================================================================
// Enums
// ============================================================================

export const NumberDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "NumberDataSourceType",
  { values: Object.values(Types.NumberDataSourceType) }
);

// ============================================================================
// Data Source Object (Output - single object, NO union)
// ============================================================================

export const NumberDataSourceObject = gqlSchemaBuilder
  .objectRef<Types.NumberDataSource>("NumberDataSource")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: NumberDataSourceTypePothosEnum }),
      numberVariableId: t.exposeInt("numberVariableId"),
    }),
  });

// ============================================================================
// Data Source Input (Simple input, NO isOneOf)
// ============================================================================

export const NumberDataSourceInputObject = gqlSchemaBuilder
  .inputRef<Types.NumberDataSourceInputGraphql>("NumberDataSourceInput")
  .implement({
    fields: t => ({
      variableId: t.int({ required: true }),
    }),
  });

// ============================================================================
// Mutation Inputs
// ============================================================================

export const NumberElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.NumberElementCreateInputGraphql>("NumberElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      textProps: t.field({ type: TextPropsInputObject, required: true }),
      dataSource: t.field({
        type: NumberDataSourceInputObject,
        required: true,
      }),
      mapping: t.field({ type: "StringMap", required: true }),
    }),
  });

export const NumberElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.NumberElementUpdateInputGraphql>("NumberElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      textProps: t.field({ type: TextPropsUpdateInputObject }),
      dataSource: t.field({ type: NumberDataSourceInputObject }),
      mapping: t.field({ type: "StringMap" }),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

const NumberElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.NumberElementPothosDefinition>(
    "NumberElement"
  );

export const NumberElementObject = gqlSchemaBuilder.loadableObject<
  Types.NumberElementPothosDefinition | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof NumberElementObjectRef
>(NumberElementObjectRef, {
  load: async ids => await NumberElementRepository.loadByIds(ids),
  sort: e => e.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === Types.ElementType.NUMBER,
  fields: t => ({
    textProps: t.expose("textProps", { type: TextPropsObject }),
    numberDataSource: t.expose("numberDataSource", { type: NumberDataSourceObject }),
    mapping: t.field({
      type: "StringMap",
      resolve: element => element.mapping,
    }),
  }),
});