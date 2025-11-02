import type * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
  FormErrors,
  UpdateStateFn,
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
} from "../../types";

export type TextPropsFormErrors = FormErrors<Graphql.TextPropsInput>;

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type TextPropsFormState = Graphql.TextPropsInput;

export type SanitizedTextPropsFormState = TextPropsFormState;

export type UpdateTextPropsFn = UpdateStateFn<Graphql.TextPropsInput>;

export type UpdateTextPropsWithElementIdFn =
  UpdateStateWithElementIdFn<TextPropsFormState>;

export type UpdateFontRefFn = (fontRef: Graphql.FontReferenceInput) => void;

export type ValidateTextPropsFieldFn = ValidateFieldFn<TextPropsFormState>;