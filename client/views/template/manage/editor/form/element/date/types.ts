import type {
  CertificateElementBaseCreateInput,
  CertificateElementBaseUpdateInput,
  DateDataSource,
  DateDataSourceInput,
  DateProps,
  DatePropsCreateInput,
  DatePropsUpdateInput,
  TextPropsCreateInput,
  TextPropsUpdateInput,
} from "@/client/graphql/generated/gql/graphql";
import { FormErrors, UpdateStateFn } from "../types";
import { TextPropsFormErrors, TextPropsState } from "../textProps";
import {
  BaseCertificateElementFormState,
  BaseElementFormErrors,
} from "../base";

// ============================================================================
// WORKING STATE TYPES
// ============================================================================

export type DatePropsState = DatePropsCreateInput | DatePropsUpdateInput;

// Complete date element working state
export type DateElementFormState = {
  base: BaseCertificateElementFormState;
  textProps: TextPropsState;
  dataSource: DateDataSourceInput;
  dateProps: DatePropsState;
};

export type DateElementFormCreateState = {
  base: CertificateElementBaseCreateInput;
  textProps: TextPropsCreateInput;
  dataSource: DateDataSourceInput;
  dateProps: DatePropsCreateInput;
};

export type DateElementFormUpdateState = {
  base: CertificateElementBaseUpdateInput;
  textProps: TextPropsUpdateInput;
  dateProps: DatePropsUpdateInput;
  dataSource: DateDataSourceInput;
};

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type DateDataSourceFormErrors = FormErrors<DateDataSourceInput>;
export type DatePropsFormErrors = FormErrors<DateProps>;

export type DateElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dateProps: DatePropsFormErrors;
  dataSource: DateDataSourceFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateDateDataSourceFn = (dataSource: DateDataSourceInput) => void;

export type UpdateDatePropsCreateFn = UpdateStateFn<DatePropsCreateInput>;

export type UpdateDatePropsUpdateFn = UpdateStateFn<DatePropsUpdateInput>;

export type UpdateDatePropsFn = UpdateStateFn<
  DatePropsCreateInput | DatePropsUpdateInput
>;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

// Convert Output type (with __typename) to Input type (OneOf)
export const dateDataSourceToGraphQL = (
  state: DateDataSource
): DateDataSourceInput => {
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
