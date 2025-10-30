import type { TextDataSourceInput } from "@/client/graphql/generated/gql/graphql";
import type { TextDataSourceFormErrors } from "./types";

export const validateTextDataSource = (
  dataSource: TextDataSourceInput
): TextDataSourceFormErrors => {
  const errors: TextDataSourceFormErrors = {};

  if (dataSource.static) {
    if (!dataSource.static.value || dataSource.static.value.trim().length === 0) {
      errors.static = "Static value is required";
    }
  } else if (dataSource.studentField) {
    if (!dataSource.studentField.field) {
      errors.studentField = "Student field is required";
    }
  } else if (dataSource.certificateField) {
    if (!dataSource.certificateField.field) {
      errors.certificateField = "Certificate field is required";
    }
  } else if (dataSource.templateTextVariable) {
    if (!dataSource.templateTextVariable.variableId || dataSource.templateTextVariable.variableId <= 0) {
      errors.templateTextVariable = "Template text variable is required";
    }
  } else if (dataSource.templateSelectVariable) {
    if (!dataSource.templateSelectVariable.variableId || dataSource.templateSelectVariable.variableId <= 0) {
      errors.templateSelectVariable = "Template select variable is required";
    }
  }

  return errors;
};

