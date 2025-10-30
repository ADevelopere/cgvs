import type * as Graphql from "@/client/graphql/generated/gql/graphql";
import { FormErrors, UpdateStateFn } from "../types";

export type TextPropsFormErrors = FormErrors<
  Graphql.TextPropsCreateInput | Graphql.TextPropsUpdateInput
>;

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type TextPropsState =
  | Graphql.TextPropsCreateInput
  | Graphql.TextPropsUpdateInput;

export type UpdateTextPropsCreateFn =
  UpdateStateFn<Graphql.TextPropsCreateInput>;

export type UpdateTextPropsUpdateFn =
  UpdateStateFn<Graphql.TextPropsUpdateInput>;

export type UpdateTextPropsFn = UpdateStateFn<
  Graphql.TextPropsCreateInput | Graphql.TextPropsUpdateInput
>;

export type UpdateFontRefFn = (fontRef: Graphql.FontReferenceInput) => void;

// ============================================================================
// TYPE GUARDS
// ============================================================================

// Type guards for FontReference (output type)
export const isFontReferenceGoogle = (
  fontRef: Graphql.FontReference
): fontRef is Graphql.FontReferenceGoogle => {
  return fontRef.__typename === "FontReferenceGoogle";
};

export const isFontReferenceSelfHosted = (
  fontRef: Graphql.FontReference
): fontRef is Graphql.FontReferenceSelfHosted => {
  return fontRef.__typename === "FontReferenceSelfHosted";
};

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================
export const fontReferenceToGraphQL = (
  state: Graphql.FontReference
): Graphql.FontReferenceInput => {
  switch (state.__typename) {
    case "FontReferenceGoogle":
      return { google: { identifier: state.identifier ?? "" } };
    case "FontReferenceSelfHosted":
      return { selfHosted: { fontId: state.fontId ?? -1 } };
    default:
      throw new Error(`Unknown font source type: ${state.__typename}`);
  }
};

export const textPropsToGraphQL = (
  state: Graphql.TextProps
): Graphql.TextPropsCreateInput | Graphql.TextPropsUpdateInput => {
  return {
    color: state.color ?? "",
    fontSize: state.fontSize ?? 12,
    overflow: state.overflow ?? "TRUNCATE",
    fontRef: fontReferenceToGraphQL(state.fontRef!),
  };
};
