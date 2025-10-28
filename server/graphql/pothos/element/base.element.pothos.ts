import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";

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
  .inputRef<Types.FontReferenceGoogleInput>("FontReferenceGoogleInput")
  .implement({
    fields: t => ({
      identifier: t.string({ required: true }),
    }),
  });

export const FontReferenceSelfHostedInputObject = gqlSchemaBuilder
  .inputRef<Types.FontReferenceSelfHostedInput>("FontReferenceSelfHostedInput")
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
        required: false,
      }),
      selfHosted: t.field({
        type: FontReferenceSelfHostedInputObject,
        required: false,
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

export const TextPropsInputObject = gqlSchemaBuilder
  .inputRef<Types.TextPropsInput>("TextPropsInput")
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
