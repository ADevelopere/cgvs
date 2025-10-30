export const validateDataSource = (
  dataSource: TextDataSourceState
): DataSourceFormErrors => {
  const errors: DataSourceFormErrors = {};

  switch (dataSource.type) {
    case "STATIC":
      if (!dataSource.value || dataSource.value.trim().length === 0) {
        errors.value = "Static value is required";
      }
      break;

    case "STUDENT_TEXT_FIELD":
      if (!dataSource.field) {
        errors.field = "Student field is required";
      }
      break;

    case "CERTIFICATE_TEXT_FIELD":
      if (!dataSource.field) {
        errors.field = "Certificate field is required";
      }
      break;

    case "TEMPLATE_TEXT_VARIABLE":
    case "TEMPLATE_SELECT_VARIABLE":
      if (!dataSource.variableId || dataSource.variableId <= 0) {
        errors.variableId = "Variable selection is required";
      }
      break;
  }

  return errors;
};

