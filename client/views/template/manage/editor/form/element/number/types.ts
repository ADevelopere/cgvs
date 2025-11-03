import type * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  Action,
  FormErrors,
  UpdateStateFn,
  UpdateStateWithElementIdFn,
  ValidateFieldFn,
} from "../../types";
import { TextPropsFormErrors } from "../textProps";
import { BaseElementFormErrors } from "../base";

// ============================================================================
// WORKING STATE TYPES
// ============================================================================

export type NumberDataSourceFormState = {
  dataSource: GQL.NumberDataSourceInput;
};

export type NumberPropsFormState = {
  numberProps: GQL.NumberElementSpecPropsInput;
};

// Complete number element working state
export type NumberElementFormState = GQL.NumberElementInput;

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type NumberDataSourceFieldErrors =
  | FormErrors<GQL.NumberDataSourceInput>
  | undefined;

export type NumberDataSourceFormErrors = {
  dataSource: NumberDataSourceFieldErrors;
};

export type NumberPropsFieldErrors =
  | FormErrors<Omit<GQL.NumberElementSpecPropsInput, "mapping">>
export type MappingFormErrors = { [key: string]: string };

export type NumberPropsFormErrors = {
  numberProps: NumberPropsFieldErrors;
  mapping: MappingFormErrors;
};


export type NumberElementFormErrors = NumberDataSourceFormErrors & NumberPropsFormErrors& {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateNumberDataSourceFn = UpdateStateFn<NumberDataSourceFormState>;

export type UpdateNumberDataSourceWithElementIdFn =
  UpdateStateWithElementIdFn<NumberDataSourceFormState>;

export type NumberDataSourceUpdateAction = Action<NumberDataSourceFormState>;

export type UpdateNumberPropsFn = UpdateStateFn<NumberPropsFormState>;

export type UpdateNumberPropsWithElementIdFn =
  UpdateStateWithElementIdFn<NumberPropsFormState>;

export type NumberPropsUpdateAction = Action<NumberPropsFormState>;

export type ValidateNumberDataSourceFn = ValidateFieldFn<
  NumberDataSourceFormState,
  NumberDataSourceFormErrors
>;

export type ValidateNumberPropsFn = ValidateFieldFn<
  NumberPropsFormState,
  NumberPropsFormErrors
>;

// ============================================================================
// SANITIZED STATE TYPES
// ============================================================================

export type SanitizedNumberDataSourceFormState = GQL.NumberDataSourceInput;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

/**
 * Convert NumberDataSource (query type) to NumberDataSourceInput (input type)
 */
export const numberDataSourceToInput = (
  numberDataSource: GQL.NumberDataSource
): GQL.NumberDataSourceInput => {
  return {
    variableId: numberDataSource.numberVariableId ?? 0,
  };
};
