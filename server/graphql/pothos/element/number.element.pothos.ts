import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element/output";
import { NumberElementRepository } from "@/server/db/repo/element";
import { TemplateRepository } from "@/server/db/repo";
import { TemplatePothosObject } from "@/server/graphql/pothos/template.pothos";
import {
  ElementTypePothosEnum,
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
      variableId: t.exposeInt("variableId"),
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
// Config Objects
// ============================================================================

export const NumberElementConfigObject = gqlSchemaBuilder
  .objectRef<Types.NumberElementConfig>("NumberElementConfig")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: ElementTypePothosEnum }),
      textProps: t.expose("textProps", { type: TextPropsObject }),
      dataSource: t.expose("dataSource", { type: NumberDataSourceObject }),
      mapping: t.field({
        type: "StringMap",
        resolve: config => config.mapping,
      }),
    }),
  });

export const NumberElementConfigInputObject = gqlSchemaBuilder
  .inputRef<Types.NumberElementConfigInputGraphql>("NumberElementConfigInput")
  .implement({
    fields: t => ({
      textProps: t.field({ type: TextPropsInputObject, required: true }),
      dataSource: t.field({
        type: NumberDataSourceInputObject,
        required: true,
      }),
      mapping: t.field({ type: "StringMap", required: true }),
    }),
  });

export const NumberElementConfigUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.NumberElementConfigUpdateInputGraphql>(
    "NumberElementConfigUpdateInput"
  )
  .implement({
    fields: t => ({
      textProps: t.field({ type: TextPropsUpdateInputObject }),
      dataSource: t.field({ type: NumberDataSourceInputObject }),
      mapping: t.field({ type: "StringMap" }),
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
      config: t.field({
        type: NumberElementConfigInputObject,
        required: true,
      }),
    }),
  });

export const NumberElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.NumberElementUpdateInputGraphql>("NumberElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      config: t.field({ type: NumberElementConfigUpdateInputObject }),
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
    config: t.expose("config", { type: NumberElementConfigObject }),
  }),
});

gqlSchemaBuilder.objectFields(NumberElementObject, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: element => element.templateId,
  }),
}));

