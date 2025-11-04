import type * as GQL from "@/client/graphql/generated/gql/graphql";
import {
  Action,
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

export type DateDataSourceFormState = {
  dataSource: GQL.DateDataSourceInput;
};

export type DatePropsFormState = GQL.DateElementSpecPropsInput;
// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type DateDataSourceFieldErrors = FormErrors<GQL.DateDataSourceInput>;
export type DateDataSourceFormErrors = {
  dataSource: DateDataSourceFieldErrors;
};

export type DatePropsFormErrors = FormErrors<GQL.DateElementSpecPropsInput>;

export type DateElementFormErrors = DateDataSourceFormErrors & {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dateProps: DatePropsFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateDateDataSourceFn = UpdateStateFn<DateDataSourceFormState>;

export type UpdateDateDataSourceWithElementIdFn =
  UpdateStateWithElementIdFn<DateDataSourceFormState>;

export type DateDataSourceUpdateAction = Action<DateDataSourceFormState>;

export type UpdateDatePropsFieldsFn =
  UpdateStateFn<GQL.DateElementSpecPropsInput>;
export type UpdateDatePropsFn = UpdateStateFn<DatePropsFormState>;

export type UpdateDatePropsWithElementIdFn =
  UpdateStateWithElementIdFn<DatePropsFormState>;

export type DatePropsUpdateAction = Action<DatePropsFormState>;

export type ValidateDatePropsFieldFn = ValidateFieldFn<
  GQL.DateElementSpecPropsInput,
  string | undefined
>;

export type ValidateDateDataSourceFn = ValidateFieldFn<
  DateDataSourceFormState,
  DateDataSourceFieldErrors
>;

export type ValidateDatePropsFn = ValidateFieldFn<
  DatePropsFormState,
  string | undefined
>;

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
