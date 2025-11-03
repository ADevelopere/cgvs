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

// Complete number element working state
export type NumberElementFormState = GQL.NumberElementInput;

export type SanitizedNumberPropsFormState = GQL.NumberElementSpecPropsInput;

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type NumberDataSourceFieldErrors =
  | FormErrors<GQL.NumberDataSourceInput>

export type NumberDataSourceFormErrors = {
  dataSource: NumberDataSourceFieldErrors;
};
export type MappingFormErrors = { [key: string]: string };
export type NumberPropsFormErrors = FormErrors<GQL.NumberElementSpecPropsInput>;

export type NumberElementFormErrors = NumberDataSourceFormErrors & {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  mapping: MappingFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateDataSourceFn = UpdateStateFn<NumberDataSourceFormState>;
export type UpdateMappingFn = (mapping: Record<string, string>) => void;

export type UpdateNumberDataSourceWithElementIdFn =
  UpdateStateWithElementIdFn<NumberDataSourceFormState>;

export type NumberDataSourceUpdateAction = Action<NumberDataSourceFormState>;

export type NumberElementSpecPropsValidateFn = ValidateFieldFn<
  GQL.NumberElementSpecPropsInput,
  string | undefined
>;
export type ValidateNumberPropsFieldFn = ValidateFieldFn<
  GQL.NumberElementSpecPropsInput,
  string | undefined
>;
export type UpdateNumberPropsWithElementIdFn =
  UpdateStateWithElementIdFn<GQL.NumberElementSpecPropsInput>;

export type ValidateNumberDataSourceFn = ValidateFieldFn<
  NumberDataSourceFormState,
  NumberDataSourceFormErrors
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
