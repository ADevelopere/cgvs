import type {
  TextDataSource,
  TextDataSourceInput,
  TextElementInput,
} from "@/client/graphql/generated/gql/graphql";
import { FormErrors } from "../../types";
import { TextPropsFormErrors } from "../textProps";
import { BaseElementFormErrors } from "../base";

// ============================================================================
// WORKING STATE TYPES (Discriminated Unions - match backend structure)
// ============================================================================

// Complete text element working state
export type TextElementFormState = TextElementInput;

// ============================================================================
// TYPE-SAFE UPDATE FUNCTIONS
// ============================================================================

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type TextDataSourceFormErrors = FormErrors<TextDataSourceInput>;

export type TextElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dataSource: TextDataSourceFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateTextDataSourceFn = (dataSource: TextDataSourceInput) => void;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

// Convert working state to GraphQL input
export const textDataSourceToInput = (
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
      return {
        templateTextVariable: { variableId: state.textVariableId ?? 0 },
      };
    case "TextDataSourceTemplateSelectVariable":
      return {
        templateSelectVariable: { variableId: state.selectVariableId ?? 0 },
      };
    default:
      throw new Error(`Unknown TextDataSource type: ${state.__typename}`);
  }
};
