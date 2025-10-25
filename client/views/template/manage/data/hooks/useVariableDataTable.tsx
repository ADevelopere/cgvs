"use client";

import { useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Table from "@/client/components/Table";
import { RecipientVariableDataTranslation } from "@/client/locale/components/RecipientVariableData";
import { getValidationError } from "../utils/validation";

// Row type for variable data table
export type VariableDataRow = {
  id: number;
  studentName: string;
  [key: string]: unknown; // For dynamic var_${id} properties
  _fullData: Graphql.RecipientWithVariableValues; // For readyStatus calculation
};

// Column type definitions
type StudentNameColumn = Table.Column<VariableDataRow>;
type TextVariableColumn = Table.EditableColumn<VariableDataRow, string, number>;
type NumberVariableColumn = Table.EditableColumn<
  VariableDataRow,
  number,
  number
>;
type DateVariableColumn = Table.EditableColumn<
  VariableDataRow,
  Date | string,
  number
>;
type SelectVariableColumn = Table.EditableColumn<
  VariableDataRow,
  string | string[],
  number
>;
type ReadyStatusColumn = Table.Column<VariableDataRow>;

interface UseVariableDataTableParams {
  variables: Graphql.TemplateVariable[];
  onUpdateCell: (
    rowId: number,
    columnId: string,
    value: unknown
  ) => Promise<void>;
  strings: RecipientVariableDataTranslation;
}

/**
 * Hook to build dynamic columns for recipient variable data table
 */
export const useVariableDataTable = ({
  variables,
  onUpdateCell,
  strings,
}: UseVariableDataTableParams) => {
  const columns = useMemo(() => {
    const cols: Array<
      | StudentNameColumn
      | TextVariableColumn
      | NumberVariableColumn
      | DateVariableColumn
      | SelectVariableColumn
      | ReadyStatusColumn
    > = [];

    // Student Name column (view-only)
    const studentNameColumn: StudentNameColumn = {
      id: "studentName" as const,
      type: "viewonly" as const,
      label: strings.studentName,
      resizable: true,
      initialWidth: 200,
      widthStorageKey: "recipient_variable_data_student_name_column_width",
      headerRenderer: () => (
        <Table.BaseHeaderRenderer label={strings.studentName} />
      ),
      viewRenderer: ({ row }) => (
        <Table.TextViewRenderer value={row.studentName} />
      ),
    };

    cols.push(studentNameColumn);

    // Sort variables by order property
    const sortedVariables = [...variables].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    // Add variable columns
    sortedVariables.forEach(variable => {
      if (!variable.id) return;

      const columnId = `var_${variable.id}`;

      switch (variable.type) {
        case "TEXT": {
          const textVar = variable as Graphql.TemplateTextVariable;
          const textColumn: TextVariableColumn = {
            id: columnId,
            type: "editable" as const,
            label: variable.name || `Variable ${variable.id}`,
            resizable: true,
            initialWidth: 150,
            widthStorageKey: `recipient_variable_data_var_${variable.id}_column_width`,
            headerRenderer: () => (
              <Table.BaseHeaderRenderer
                label={variable.name || `Variable ${variable.id}`}
              />
            ),
            viewRenderer: ({ row }) => (
              <Table.TextViewRenderer value={row[columnId] as string} />
            ),
            editRenderer: ({ row, ...props }) => (
              <Table.TextEditRenderer
                {...props}
                value={(row[columnId] as string) || ""}
                validator={value => getValidationError(value, textVar)}
              />
            ),
            onUpdate: async (rowId, value) =>
              await onUpdateCell(rowId, columnId, value),
          };
          cols.push(textColumn);
          break;
        }

        case "NUMBER": {
          const numberVar = variable as Graphql.TemplateNumberVariable;
          const numberColumn: NumberVariableColumn = {
            id: columnId,
            type: "editable" as const,
            label: variable.name || `Variable ${variable.id}`,
            resizable: true,
            initialWidth: 150,
            widthStorageKey: `recipient_variable_data_var_${variable.id}_column_width`,
            headerRenderer: () => (
              <Table.BaseHeaderRenderer
                label={variable.name || `Variable ${variable.id}`}
              />
            ),
            viewRenderer: ({ row }) => (
              <Table.NumberViewRenderer value={row[columnId] as number} />
            ),
            editRenderer: ({ row, ...props }) => (
              <Table.NumberEditRenderer
                {...props}
                value={row[columnId] as number}
                validator={value => getValidationError(value, numberVar)}
              />
            ),
            onUpdate: async (rowId, value) =>
              await onUpdateCell(rowId, columnId, value),
          };
          cols.push(numberColumn);
          break;
        }

        case "DATE": {
          const dateVar = variable as Graphql.TemplateDateVariable;
          const dateColumn: DateVariableColumn = {
            id: columnId,
            type: "editable" as const,
            label: variable.name || `Variable ${variable.id}`,
            resizable: true,
            initialWidth: 150,
            widthStorageKey: `recipient_variable_data_var_${variable.id}_column_width`,
            headerRenderer: () => (
              <Table.BaseHeaderRenderer
                label={variable.name || `Variable ${variable.id}`}
              />
            ),
            viewRenderer: ({ row }) => (
              <Table.DateViewRenderer
                value={row[columnId] as Date}
                format="PP"
              />
            ),
            editRenderer: ({ row, ...props }) => (
              <Table.DateEditRenderer
                {...props}
                value={row[columnId] as Date}
                validator={value => getValidationError(value, dateVar)}
              />
            ),
            onUpdate: async (rowId, value) =>
              await onUpdateCell(
                rowId,
                columnId,
                value instanceof Date ? value.toISOString() : value
              ),
          };
          cols.push(dateColumn);
          break;
        }

        case "SELECT": {
          const selectVar = variable as Graphql.TemplateSelectVariable;
          const options = [
            { label: strings.none || "None", value: "" },
            ...(selectVar.options || []).map(option => ({
              label: option,
              value: option,
            })),
          ];

          const selectColumn: SelectVariableColumn = {
            id: columnId,
            type: "editable" as const,
            label: variable.name || `Variable ${variable.id}`,
            resizable: true,
            initialWidth: 150,
            widthStorageKey: `recipient_variable_data_var_${variable.id}_column_width`,
            headerRenderer: () => (
              <Table.BaseHeaderRenderer
                label={variable.name || `Variable ${variable.id}`}
              />
            ),
            viewRenderer: ({ row }) => (
              <Table.SelectViewRenderer
                value={row[columnId] as string}
                options={options}
              />
            ),
            editRenderer: ({ row, ...props }) => (
              <Table.SelectEditRenderer
                {...props}
                value={(row[columnId] as string) || ""}
                options={options}
              />
            ),
            onUpdate: async (rowId, value) =>
              await onUpdateCell(rowId, columnId, value),
          };
          cols.push(selectColumn);
          break;
        }
      }
    });

    // TODO: Add Ready Status column with custom renderer
    // const readyStatusColumn: ReadyStatusColumn = {
    //   id: "readyStatus" as const,
    //   type: "viewonly" as const,
    //   label: strings.readyStatus,
    //   resizable: true,
    //   initialWidth: 120,
    //   widthStorageKey: "recipient_variable_data_ready_status_column_width",
    //   headerRenderer: () => (
    //     <Table.BaseHeaderRenderer label={strings.readyStatus} />
    //   ),
    //   viewRenderer: ({ row }) => (
    //     <ReadyStatusViewRenderer row={row} variables={variables} />
    //   ),
    // };
    // cols.push(readyStatusColumn);

    return cols;
  }, [variables, onUpdateCell, strings]);

  return { columns };
};
