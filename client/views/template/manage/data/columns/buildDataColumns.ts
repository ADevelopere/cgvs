import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { EditableColumn, ColumnTypes } from "@/client/types/table.type";
import { getValidationError, isRecipientReady } from "../utils/validation";
import { RecipientVariableDataTranslation } from "@/client/locale/components/RecipientVariableData";

/**
 * Map template variable types to table column types
 */
const mapVariableTypeToColumnType = (
  type: Graphql.TemplateVariableType
): string => {
  switch (type) {
    case "TEXT":
      return "templateText";
    case "NUMBER":
      return "templateNumber";
    case "DATE":
      return "templateDate";
    case "SELECT":
      return "templateSelect";
    default:
      return "text";
  }
};

/**
 * Build dynamic columns for recipient variable data table
 */
export const buildDataColumns = (
  variables: Graphql.TemplateVariable[],
  strings: RecipientVariableDataTranslation,
  onUpdateCell: (
    rowId: number,
    columnId: string,
    value: unknown
  ) => Promise<void>
): EditableColumn[] => {
  // Start with Student Name column (non-editable, sortable, resizable)
  const columns: EditableColumn[] = [
    {
      id: "studentName",
      type: "text",
      label: strings.studentName,
      accessor: "studentName",
      editable: false,
      sortable: true,
      resizable: true,
      initialWidth: 200,
      widthStorageKey: "recipient_variable_data_student_name_column_width",
    },
  ];

  // Sort variables by order property
  const sortedVariables = [...variables].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  // Add variable columns
  sortedVariables.forEach(variable => {
    if (!variable.id) return;

    const columnId = `var_${variable.id}`;
    const columnType = mapVariableTypeToColumnType(variable.type || "TEXT");

    const column: EditableColumn = {
      id: columnId,
      type: columnType as ColumnTypes,
      label: variable.name || `Variable ${variable.id}`,
      accessor: (row: Graphql.RecipientWithVariableValues) =>
        (row.variableValues as Record<string, unknown>)?.[variable.id?.toString() || ""],
      editable: true,
      resizable: true,
      required: variable.required || false,
      initialWidth: 150,
      widthStorageKey: `recipient_variable_data_var_${variable.id}_column_width`,
      onUpdate: (rowId: number, value: unknown) =>
        onUpdateCell(rowId, columnId, value),
      getIsValid: (value: unknown) => getValidationError(value, variable),
    };

    // Add type-specific properties
    switch (variable.type) {
      case "TEXT": {
        const textVar = variable as Graphql.TemplateTextVariable;
        column.minLength = textVar.minLength || undefined;
        column.maxLength = textVar.maxLength || undefined;
        column.pattern = textVar.pattern || undefined;
        break;
      }
      case "NUMBER": {
        const numberVar = variable as Graphql.TemplateNumberVariable;
        column.minValue = numberVar.minValue || undefined;
        column.maxValue = numberVar.maxValue || undefined;
        column.decimalPlaces = numberVar.decimalPlaces || undefined;
        break;
      }
      case "DATE": {
        const dateVar = variable as Graphql.TemplateDateVariable;
        column.minDate = dateVar.minDate || undefined;
        column.maxDate = dateVar.maxDate || undefined;
        column.format = dateVar.format || undefined;
        break;
      }
      case "SELECT": {
        const selectVar = variable as Graphql.TemplateSelectVariable;
        column.options = [
          { label: strings.none || "None", value: null },
          ...(selectVar.options || []).map(option => ({
            label: option,
            value: option,
          })),
        ];
        column.multiple = selectVar.multiple || false;
        break;
      }
    }

    columns.push(column);
  });

  // Add Ready Status column (non-editable, shows validation status)
  columns.push({
    id: "readyStatus",
    type: "readyStatus",
    label: strings.readyStatus,
    accessor: (row: Record<string, unknown>) => {
      const variableValues =
        (row.variableValues as Record<string, unknown>) || {};
      const isReady = isRecipientReady(variableValues, variables);
      return {
        isReady,
        variables,
        variableValues,
      };
    },
    editable: false,
    resizable: true,
    initialWidth: 120,
    widthStorageKey: "recipient_variable_data_ready_status_column_width",
  });

  return columns;
};
