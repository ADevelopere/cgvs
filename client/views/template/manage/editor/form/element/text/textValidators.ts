import type {
  TextDataSourceFormErrors,
  validateTextDataSourceFn,
} from "./types";

export const validateTextDataSource = () => {
  const validator: validateTextDataSourceFn = ({
    value: source,
  }): TextDataSourceFormErrors => {
    if (source.static?.value.trim().length === 0) {
      return { dataSource: { static: "Static value is required" } };
    }
    if (source.certificateField && !source.certificateField.field) {
      return {
        dataSource: { certificateField: "Certificate field is required" },
      };
    }

    if (source.studentField && !source.studentField.field) {
      return { dataSource: { studentField: "Student field is required" } };
    }

    if (
      source.templateTextVariable &&
      !source.templateTextVariable.variableId
    ) {
      return {
        dataSource: {
          templateTextVariable: "Template text variable is required",
        },
      };
    }
    if (
      source.templateSelectVariable &&
      !source.templateSelectVariable.variableId
    ) {
      return {
        dataSource: {
          templateSelectVariable: "Template select variable is required",
        },
      };
    }

    return {
      dataSource: undefined,
    }
  };

  return validator;
};
