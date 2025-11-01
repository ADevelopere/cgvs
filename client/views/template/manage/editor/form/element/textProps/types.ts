import type * as Graphql from "@/client/graphql/generated/gql/graphql";
import { FormErrors, UpdateStateFn } from "../../types";

export type TextPropsFormErrors = FormErrors<Graphql.TextPropsInput>;

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type TextPropsState = Graphql.TextPropsInput;

export type UpdateTextPropsFn = UpdateStateFn<Graphql.TextPropsInput>;

export type UpdateFontRefFn = (fontRef: Graphql.FontReferenceInput) => void;
