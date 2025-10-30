import type {
  TextDataSource,
  TextDataSourceInput,
  TextDataSourceType,
} from "@/client/graphql/generated/gql/graphql";
import { FormErrors } from "../types";
import { TextPropsFormErrors, TextPropsState } from "../textProps";
import {
  BaseCertificateElementFormState,
  BaseElementFormErrors,
} from "../base";

// ============================================================================
// WORKING STATE TYPES (Discriminated Unions - match backend structure)
// ============================================================================

// Complete text element working state
export type TextElementFormState = {
  base: BaseCertificateElementFormState;
  textProps: TextPropsState;
  dataSource: TextDataSourceInput;
};

// ============================================================================
// TYPE-SAFE UPDATE FUNCTIONS
// ============================================================================

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type DataSourceFormErrors = FormErrors<TextDataSourceInput>;

export type TextElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dataSource: DataSourceFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateDataSourceFn = (dataSource: TextDataSourceInput) => void;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

// Convert working state to GraphQL input
export const textDataSourceToGraphQL = (
  state: TextDataSource
): TextDataSourceInput => {
  switch (state.__typename) {
    case "TextDataSourceStatic":
      return { static: { value: state.value ?? "" } };
    case "TextDataSourceStudentField":
      return { studentField: { field: state.studentField! } };
    case "TextDataSourceCertificateField":
      return { certificateField: { field: state.certificateField! } };
    case "TextDataSourceTemplateTextVariable":
      return { templateTextVariable: { variableId: state.textVariableId ?? 0 } };
    case "TextDataSourceTemplateSelectVariable":
      return { templateSelectVariable: { variableId: state.selectVariableId ?? 0 } };
    default:
      throw new Error(`Unknown TextDataSource type: ${state.__typename}`);
  }
};
