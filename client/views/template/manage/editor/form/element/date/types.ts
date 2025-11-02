import type * as GQL from "@/client/graphql/generated/gql/graphql";
import { FormErrors, UpdateStateFn, ValidateFieldFn } from "../../types";
import { TextPropsFormErrors } from "../textProps";
import { BaseElementFormErrors } from "../base";

// ============================================================================
// WORKING STATE TYPES
// ============================================================================

export type DatePropsState = GQL.DateElementSpecPropsInput;
// Complete date element working state
export type DateElementFormState = GQL.DateElementInput;

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type DateDataSourceFormErrors = FormErrors<GQL.DateDataSourceInput>;
export type DatePropsFormErrors = FormErrors<GQL.DateElementSpecPropsInput>;

export type DateElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dateProps: DatePropsFormErrors;
  dataSource: DateDataSourceFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateDateDataSourceFn = (
  dataSource: GQL.DateDataSourceInput
) => void;

export type UpdateDatePropsFn = UpdateStateFn<GQL.DateElementSpecPropsInput>;

export type ValidateDatePropsFieldFn = ValidateFieldFn<GQL.DateElementSpecPropsInput>;