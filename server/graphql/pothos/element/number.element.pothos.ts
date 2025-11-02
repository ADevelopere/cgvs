import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { NumberElementRepository } from "@/server/db/repo/element";
import {
  CertificateElementBaseInputObject,
  CertificateElementPothosInterface,
  isOfElement,
} from "./base.element.pothos";
import { InputFieldBuilder, SchemaTypes } from "@pothos/core";
import {
  createTextPropsFieldFromEntity,
  TextPropsInputObject,
} from "./textProps.pothos";

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

export const NumberElementSpecPropsInputObject = gqlSchemaBuilder
  .inputRef<Types.NumberElementSpecPropsInput>("NumberElementSpecPropsInput")
  .implement({
    fields: t => ({
      mapping: t.field({ type: "StringMap", required: true }),
    }),
  });

const createNumberElementInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  base: t.field({
    type: CertificateElementBaseInputObject,
    required: true,
  }),
  textProps: t.field({ type: TextPropsInputObject, required: true }),
  numberProps: t.field({
    type: NumberElementSpecPropsInputObject,
    required: true,
  }),
  dataSource: t.field({
    type: NumberDataSourceInputObject,
    required: true,
  }),
});

export const NumberElementInputObject = gqlSchemaBuilder
  .inputRef<Types.NumberElementInputGraphql>("NumberElementInput")
  .implement({
    fields: t => ({
      ...createNumberElementInputFields(t),
    }),
  });

export const NumberElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.NumberElementUpdateInputGraphql>("NumberElementUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createNumberElementInputFields(t),
    }),
  });

export const NumberElementDataSourceStandaloneUpdateInputObject =
  gqlSchemaBuilder
    .inputRef<Types.NumberElementDataSourceStandaloneUpdateInputGraphql>(
      "NumberElementDataSourceStandaloneUpdateInput"
    )
    .implement({
      fields: t => ({
        elementId: t.int({ required: true }),
        dataSource: t.field({
          type: NumberDataSourceInputObject,
          required: true,
        }),
      }),
    });

export const NumberElementSpecPropsStandaloneUpdateInputObject =
  gqlSchemaBuilder
    .inputRef<Types.NumberElementSpecPropsStandaloneUpdateInput>(
      "NumberElementSpecPropsStandaloneUpdateInput"
    )
    .implement({
      fields: t => ({
        elementId: t.int({ required: true }),
        numberProps: t.field({
          type: NumberElementSpecPropsInputObject,
          required: true,
        }),
      }),
    });

export const NumberElementSpecPropsUpdateResponseObject = gqlSchemaBuilder
  .objectRef<Types.NumberElementSpecPropsUpdateResponse>(
    "NumberElementSpecPropsUpdateResponse"
  )
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId"),
      numberProps: t.expose("numberProps", {
        type: NumberPropsObject,
      }),
    }),
  });

export const NumberElementDataSourceUpdateResponseObject = gqlSchemaBuilder
  .objectRef<Types.NumberElementDataSourceUpdateResponse>(
    "NumberElementDataSourceUpdateResponse"
  )
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId"),
      numberDataSource: t.expose("numberDataSource", {
        type: NumberDataSourceObject,
      }),
    }),
  });
// ============================================================================
// Loadable Element Object
// ============================================================================

export const NumberPropsObject = gqlSchemaBuilder
  .objectRef<Types.NumberElementSpecProps>("NumberProps")
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId"),
      textPropsId: t.exposeInt("textPropsId"),
      variableId: t.exposeInt("variableId"),
      mapping: t.field({
        type: "StringMap",
        resolve: props => props.mapping,
      }),
    }),
  });

const NumberElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.NumberElementOutput>("NumberElement");

export const NumberElementObject = gqlSchemaBuilder.loadableObject<
  Types.NumberElementOutput | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof NumberElementObjectRef
>(NumberElementObjectRef, {
  load: async ids => await NumberElementRepository.loadByIds(ids),
  sort: e => e.base.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item => isOfElement(item, Types.ElementType.NUMBER),
  fields: t => ({
    textProps: createTextPropsFieldFromEntity(t),
    numberProps: t.expose("numberProps", { type: NumberPropsObject }),
    numberDataSource: t.expose("numberDataSource", {
      type: NumberDataSourceObject,
    }),
  }),
});
