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
// WORKING STATE TYPES (Discriminated Unions - match backend structure)
// ============================================================================

// Complete text element working state
export type TextElementFormState = GQL.TextElementInput;
export type TextDataSourceFormState = {
  dataSource: GQL.TextDataSourceInput;
};
// ============================================================================
// TYPE-SAFE UPDATE FUNCTIONS
// ============================================================================

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================
export type TextDataSourceFieldErrors = FormErrors<GQL.TextDataSourceInput> 
export type TextDataSourceFormErrors = {
  dataSource: TextDataSourceFieldErrors
};

export type TextElementFormErrors = TextDataSourceFormErrors & {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateTextDataSourceFn = UpdateStateFn<TextDataSourceFormState>;
export type UpdateTextDataSourceWithElementIdFn =
  UpdateStateWithElementIdFn<TextDataSourceFormState>;

export type TextDataSourceUpdateAction = Action<TextDataSourceFormState>;

// ============================================================================
// SANITIZED STATE TYPES
// ============================================================================

export type validateTextDataSourceFn = ValidateFieldFn<
  TextDataSourceFormState,
  TextDataSourceFormErrors
>;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

// Convert working state to GraphQL input
export const textDataSourceToInput = (
  state: GQL.TextDataSource
): GQL.TextDataSourceInput => {
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

export const textDataSourceActionInputToInput = (
  action: TextDataSourceUpdateAction
): GQL.TextDataSourceInput => {
  const { value: source } = action;

  if (source.static) {
    return { static: { value: source.static.value ?? "" } };
  }
  if (source.certificateField) {
    return { certificateField: { field: source.certificateField.field } };
  }
  if (source.studentField) {
    return { studentField: { field: source.studentField.field } };
  }

  if (source.templateTextVariable) {
    return {
      templateTextVariable: {
        variableId: source.templateTextVariable.variableId ?? 0,
      },
    };
  }
  if (source.templateSelectVariable) {
    return {
      templateSelectVariable: {
        variableId: source.templateSelectVariable.variableId ?? 0,
      },
    };
  }

  throw new Error(`Unknown TextDataSource key`);
};
