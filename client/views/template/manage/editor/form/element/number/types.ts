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

export type NumberPropsFormState = GQL.NumberElementSpecPropsInput;

// Complete number element working state
export type NumberElementFormState = GQL.NumberElementInput;

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type NumberDataSourceFieldErrors = FormErrors<GQL.NumberDataSourceInput>;

export type NumberDataSourceFormErrors = {
  dataSource: NumberDataSourceFieldErrors;
};

export type NumberMappingFormErrors = { [key: string]: string };

export type NumberPropsFormErrors = FormErrors<
  Omit<GQL.NumberElementSpecPropsInput, "mapping">
> & {
  mapping?: NumberMappingFormErrors;
};

export type NumberElementFormErrors = NumberDataSourceFormErrors & {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  numberProps: NumberPropsFormErrors;
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

export type ValidateNumberDataSourceFn = ValidateFieldFn<
  NumberDataSourceFormState,
  NumberDataSourceFormErrors
>;

export type ValidateNumberPropsFn = ValidateFieldFn<
  NumberPropsFormState,
  string | NumberMappingFormErrors | undefined
>;

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
