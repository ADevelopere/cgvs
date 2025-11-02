import type {
  NumberDataSource,
  NumberDataSourceInput,
  NumberElementInput,
  NumberElementSpecPropsInput,
} from "@/client/graphql/generated/gql/graphql";
import {
  FormErrors,
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
} from "../../types";
import { TextPropsFormErrors } from "../textProps";
import { BaseElementFormErrors } from "../base";

// ============================================================================
// WORKING STATE TYPES
// ============================================================================

// Complete number element working state
export type NumberElementFormState = NumberElementInput;

export type SanitizedNumberPropsFormState = NumberElementSpecPropsInput;

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type DataSourceFormErrors = FormErrors<NumberDataSourceInput>;
export type MappingFormErrors = { [key: string]: string };
export type NumberPropsFormErrors = FormErrors<NumberElementSpecPropsInput>;

export type NumberElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dataSource: DataSourceFormErrors;
  mapping: MappingFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateDataSourceFn = (dataSource: NumberDataSourceInput) => void;
export type UpdateMappingFn = (mapping: Record<string, string>) => void;

export type UpdateNumberDataSourceWithElementIdFn = (
  elementId: number,
  dataSource: NumberDataSourceInput
) => void;

export type NumberElementSpecPropsValidateFn =
  ValidateFieldFn<NumberElementSpecPropsInput>;
export type ValidateNumberPropsFieldFn =
  ValidateFieldFn<NumberElementSpecPropsInput>;
export type UpdateNumberPropsWithElementIdFn =
  UpdateStateWithElementIdFn<NumberElementSpecPropsInput>;

// ============================================================================
// SANITIZED STATE TYPES
// ============================================================================

export type SanitizedNumberDataSourceFormState = NumberDataSourceInput;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

/**
 * Convert NumberDataSource (query type) to NumberDataSourceInput (input type)
 */
export const numberDataSourceToInput = (
  numberDataSource: NumberDataSource
): NumberDataSourceInput => {
  return {
    variableId: numberDataSource.numberVariableId ?? 0,
  };
};
