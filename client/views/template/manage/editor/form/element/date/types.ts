import type * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  FormErrors,
  UpdateStateFn,
  ValidateFieldFn,
  UpdateStateWithElementIdFn,
} from "../../types";
import { TextPropsFormErrors } from "../textProps";
import { BaseElementFormErrors } from "../base";

// ============================================================================
// WORKING STATE TYPES
// ============================================================================

export type DatePropsState = GQL.DateElementSpecPropsInput;
// Complete date element working state
export type DateElementFormState = GQL.DateElementInput;

export type SanitizedDatePropsFormState = DatePropsState;

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

export type UpdateDateDataSourceWithElementIdFn = (
  elementId: number,
  dataSource: GQL.DateDataSourceInput
) => void;

export type UpdateDatePropsFn = UpdateStateFn<GQL.DateElementSpecPropsInput>;

export type UpdateDatePropsWithElementIdFn =
  UpdateStateWithElementIdFn<DatePropsState>;

export type ValidateDatePropsFieldFn = ValidateFieldFn<GQL.DateElementSpecPropsInput>;

// ============================================================================
// SANITIZED STATE TYPES
// ============================================================================

export type SanitizedDateDataSourceFormState = GQL.DateDataSourceInput;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

/**
 * Convert DateDataSource (query union type) to DateDataSourceInput (OneOf input type)
 */
export const dateDataSourceToInput = (
  state: GQL.DateDataSource
): GQL.DateDataSourceInput => {
  switch (state.__typename) {
    case "DateDataSourceStatic":
      return { static: { value: state.value ?? "" } };
    case "DateDataSourceStudentField":
      return { studentField: { field: state.studentField! } };
    case "DateDataSourceCertificateField":
      return { certificateField: { field: state.certificateField! } };
    case "DateDataSourceTemplateVariable":
      return {
        templateVariable: { variableId: state.dateVariableId ?? 0 },
      };
    default:
      throw new Error(`Unknown DateDataSource type: ${state.__typename}`);
  }
};