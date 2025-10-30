import {
  gqlSchemaBuilder,
  PothosTypes,
} from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import type { InputFieldBuilder, SchemaTypes } from "@pothos/core";
import { ElementOverflowPothosEnum } from "./elementEnum.pothos";
import { TextPropsUtils } from "@/server/utils";

export const FontSourcePothosEnum = gqlSchemaBuilder.enumType("FontSource", {
  values: Object.values(Types.FontSource),
});

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

export const createTextPropsFieldFromEntity = (
  t: PothosSchemaTypes.ObjectFieldBuilder<
    PothosSchemaTypes.ExtendDefaultTypes<PothosTypes>,
    Types.CountryElementOutput
  >
) =>
  t.field({
    type: TextPropsObject,
    resolve: element =>
      TextPropsUtils.entityToTextProps(element.textPropsEntity),
  });
