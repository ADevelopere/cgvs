import type { TextDataSourceFieldErrors, validateTextDataSourceFn } from "./types";

export const validateTextDataSource = () => {
  const validator: validateTextDataSourceFn = ({ value: source }): TextDataSourceFieldErrors => {
    if (source.static?.value.trim().length === 0) {
      return { static: "Static value is required" };
    }
    if (source.certificateField && !source.certificateField.field) {
      return {
        certificateField: "Certificate field is required",
      };
    }

    if (source.studentField && !source.studentField.field) {
      return { studentField: "Student field is required" };
    }

    if (source.templateTextVariable && !source.templateTextVariable.variableId) {
      return {
        templateTextVariable: "Template text variable is required",
      };
    }
    if (source.templateSelectVariable && !source.templateSelectVariable.variableId) {
      return {
        templateSelectVariable: "Template select variable is required",
      };
    }

    return {};
  };

  return validator;
};
