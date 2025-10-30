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
      fontRef: t.expose("fontRef", { type: FontReferenceUnion }),
      fontSize: t.exposeInt("fontSize"),
      color: t.exposeString("color"),
      overflow: t.expose("overflow", { type: ElementOverflowPothosEnum }),
    }),
  });

export const TextPropsCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.TextPropsCreateInputGraphql>("TextPropsCreateInput")
  .implement({
    fields: t => ({
      fontRef: t.field({ type: FontReferenceInputObject, required: true }),
      fontSize: t.int({ required: true }),
      color: t.string({ required: true }),
      overflow: t.field({ type: ElementOverflowPothosEnum, required: true }),
    }),
  });

export const TextPropsUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.TextPropsUpdateInputGraphql>("TextPropsUpdateInput")
  .implement({
    fields: t => ({
      fontRef: t.field({ type: FontReferenceInputObject, required: true }),
      fontSize: t.int({ required: true }),
      color: t.string({ required: true }),
      overflow: t.field({ type: ElementOverflowPothosEnum, required: true }),
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
  templateId: t.int({ required: true }),
  name: t.string({ required: true }),
  description: t.string({ required: true }),
  positionX: t.int({ required: true }),
  positionY: t.int({ required: true }),
  width: t.int({ required: true }),
  height: t.int({ required: true }),
  alignment: t.field({ type: ElementAlignmentPothosEnum, required: true }),
  renderOrder: t.int({ required: true }),
});

/**
 * Helper to create shared base element input fields for update operations
 * All fields are optional (except id which should be added separately)
 */
export const createBaseElementUpdateInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  id: t.int({ required: true }),
  name: t.string(),
  description: t.string(),
  positionX: t.int(),
  positionY: t.int(),
  width: t.int(),
  height: t.int(),
  alignment: t.field({ type: ElementAlignmentPothosEnum, required: false }),
  renderOrder: t.int(),
});

export const CertificateElementBaseCreateInputInputObject = gqlSchemaBuilder
  .inputRef<Types.CertificateElementBaseCreateInput>(
    "CertificateElementBaseCreateInput"
  )
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
    }),
  });

export const CertificateElementBaseUpdateInputInputObject = gqlSchemaBuilder
  .inputRef<Types.CertificateElementBaseUpdateInput>(
    "CertificateElementBaseUpdateInput"
  )
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
    }),
  });

// ============================================================================
// CertificateElement Interface (shared fields for all element types)
// ============================================================================

export const CertificateElementPothosInterface = gqlSchemaBuilder
  .loadableInterfaceRef<Types.CertificateElementPothosBase, number>(
    "CertificateElement",
    {
      load: async ids => await ElementRepository.loadByIds(ids),
      sort: e => e.id,
    }
  )
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

// Add template field using interfaceFields (separate from interface definition)
gqlSchemaBuilder.interfaceFields(CertificateElementPothosInterface, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: element => element.templateId,
  }),
}));
