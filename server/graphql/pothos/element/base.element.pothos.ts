import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { TemplateRepository } from "@/server/db/repo";
import { ElementRepository } from "@/server/db/repo/element";
import { TemplatePothosObject } from "@/server/graphql/pothos/template.pothos";
import type { InputFieldBuilder, SchemaTypes } from "@pothos/core";

// ============================================================================
// Shared Enums
// ============================================================================

export const FontSourcePothosEnum = gqlSchemaBuilder.enumType("FontSource", {
  values: Object.values(Types.FontSource),
});

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

// ============================================================================
// FontReference Union (Output)
// ============================================================================

export const FontReferenceGoogleObject = gqlSchemaBuilder
  .objectRef<
    Extract<Types.FontReference, { type: Types.FontSource.GOOGLE }>
  >("FontReferenceGoogle")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: FontSourcePothosEnum }),
      identifier: t.exposeString("identifier"),
    }),
  });

export const FontReferenceSelfHostedObject = gqlSchemaBuilder
  .objectRef<
    Extract<Types.FontReference, { type: Types.FontSource.SELF_HOSTED }>
  >("FontReferenceSelfHosted")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: FontSourcePothosEnum }),
      fontId: t.exposeInt("fontId"),
    }),
  });

export const FontReferenceUnion = gqlSchemaBuilder.unionType("FontReference", {
  types: [FontReferenceGoogleObject, FontReferenceSelfHostedObject],
  resolveType: ref =>
    ref.type === Types.FontSource.GOOGLE
      ? "FontReferenceGoogle"
      : "FontReferenceSelfHosted",
});

// ============================================================================
// FontReference Input
// ============================================================================
// Individual input types for each variant
export const FontReferenceGoogleInputObject = gqlSchemaBuilder
  .inputRef<Types.FontReferenceGoogleInputGraphql>("FontReferenceGoogleInput")
  .implement({
    fields: t => ({
      identifier: t.string({ required: true }),
    }),
  });

export const FontReferenceSelfHostedInputObject = gqlSchemaBuilder
  .inputRef<Types.FontReferenceSelfHostedInputGraphql>(
    "FontReferenceSelfHostedInput"
  )
  .implement({
    fields: t => ({
      fontId: t.int({ required: true }),
    }),
  });

export const FontReferenceInputObject = gqlSchemaBuilder.inputType(
  "FontReferenceInput",
  {
    isOneOf: true,
    fields: t => ({
      google: t.field({
        type: FontReferenceGoogleInputObject,
      }),
      selfHosted: t.field({
        type: FontReferenceSelfHostedInputObject,
      }),
    }),
  }
);
// ============================================================================
// TextProps Objects
// ============================================================================

export const TextPropsObject = gqlSchemaBuilder
  .objectRef<Types.TextProps>("TextProps")
  .implement({
    fields: t => ({
      id: t.exposeInt("id"),
      fontRef: t.expose("fontRef", { type: FontReferenceUnion }),
      fontSize: t.exposeInt("fontSize"),
      color: t.exposeString("color"),
      overflow: t.expose("overflow", { type: ElementOverflowPothosEnum }),
    }),
  });

const createTextPropsInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  fontRef: t.field({ type: FontReferenceInputObject, required: true }),
  fontSize: t.int({ required: true }),
  color: t.string({ required: true }),
  overflow: t.field({ type: ElementOverflowPothosEnum, required: true }),
});

export const TextPropsInputObject = gqlSchemaBuilder
  .inputRef<Types.TextPropsInputGraphql>("TextPropsInput")
  .implement({
    fields: t => ({
      ...createTextPropsInputFields(t),
    }),
  });

export const TextPropsUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.TextPropsUpdateInputGraphql>("TextPropsUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createTextPropsInputFields(t),
    }),
  });

// ============================================================================
// Element Order Update Input (for batch operations)
// ============================================================================

export const ElementOrderUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.ElementOrderUpdateInput>("ElementOrderUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      renderOrder: t.int({ required: true }),
    }),
  });

// ============================================================================
// Input Field Helpers (to reduce duplication across element types)
// ============================================================================
/**
 * Helper to create shared base element input fields for create operations
 * All fields are required
 */
export const createBaseElementInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  name: t.string({ required: true }),
  description: t.string({ required: true }),
  positionX: t.int({ required: true }),
  positionY: t.int({ required: true }),
  width: t.int({ required: true }),
  height: t.int({ required: true }),
  alignment: t.field({ type: ElementAlignmentPothosEnum, required: true }),
  renderOrder: t.int({ required: true }),
});

export const CertificateElementBaseInputObject = gqlSchemaBuilder
  .inputRef<Types.CertificateElementBaseInput>("CertificateElementBaseInput")
  .implement({
    fields: t => ({
      templateId: t.int({ required: true }),
      ...createBaseElementInputFields(t),
    }),
  });

export const CertificateElementBaseUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.CertificateElementBaseUpdateInput>(
    "CertificateElementBaseUpdateInput"
  )
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createBaseElementInputFields(t),
    }),
  });

// ============================================================================
// CertificateElement Interface (shared fields for all element types)
// ============================================================================

export const CertificateElementBaseObject = gqlSchemaBuilder
  .objectRef<Types.CertificateElementEntity>("CertificateElementBase")
  .implement({
    fields: t => ({
      id: t.exposeInt("id"),
      name: t.exposeString("name"),
      description: t.exposeString("description"),
      type: t.field({
        type: ElementTypePothosEnum,
        resolve: element => element.type as Types.ElementType,
      }),
      positionX: t.exposeInt("positionX"),
      positionY: t.exposeInt("positionY"),
      width: t.exposeInt("width"),
      height: t.exposeInt("height"),
      alignment: t.field({
        type: ElementAlignmentPothosEnum,
        resolve: element => element.alignment as Types.ElementAlignment,
      }),
      renderOrder: t.exposeInt("renderOrder"),
      createdAt: t.expose("createdAt", { type: "DateTime" }),
      updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    }),
  });

export const CertificateElementPothosInterface = gqlSchemaBuilder
  .loadableInterfaceRef<Types.CertificateElementInterface, number>(
    "CertificateElement",
    {
      load: async ids => await ElementRepository.loadByIds(ids),
      sort: e => e.base.id,
    }
  )
  .implement({
    fields: t => ({
      base: t.expose("base", { type: CertificateElementBaseObject }),
    }),
  });

// Add template field using interfaceFields (separate from interface definition)
gqlSchemaBuilder.interfaceFields(CertificateElementPothosInterface, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: element => element.base.templateId,
  }),
}));
