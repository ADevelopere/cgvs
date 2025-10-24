/**
 * @deprecated This file is no longer used after the Table refactor to renderer-based architecture.
 * It will be removed during manual cleanup. Do not use in new code.
 * See client/components/Table/renderers/ for replacement components.
 */

"use client";

import React, { useMemo } from "react";
import { Tooltip, Box, IconButton } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { EditableColumn } from "@/client/components/Table/table.type";
import { DataCellState } from "@/client/components/Table/TableBody/DataCell";
import { isRecipientReady } from "../../utils/validation";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

// Props for the main component
type ReadyStatusCellRendererProps = {
  column: EditableColumn;
  cellValue: Graphql.RecipientWithVariableValues;
  state: DataCellState;
  setState: React.Dispatch<React.SetStateAction<DataCellState>>;
  commonProps: object;
  validateValue: (value: unknown) => string | null;
  handleInputKeyDown: (e: React.KeyboardEvent) => void;
  handleBlur: () => void;
};

// Get tooltip message for ready status
const getTooltipMessage = (
  isReady: boolean,
  variables: Graphql.TemplateVariable[],
  variableValues: Record<string, unknown>
): string => {
  if (isReady) {
    return "All required fields complete";
  }

  const requiredVariables = variables.filter(variable => variable.required);
  const missingFields: string[] = [];
  const invalidFields: string[] = [];

  for (const variable of requiredVariables) {
    const value = variableValues[variable.id?.toString() || ""];

    // Check if value exists
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      missingFields.push(variable.name || `Variable ${variable.id}`);
      continue;
    }

    // Check if value passes validation
    let validationError: string | null = null;

    switch (variable.type) {
      case "TEXT": {
        const textVar = variable as Graphql.TemplateTextVariable;
        const textValue = typeof value === "string" ? value : String(value);
        if (textVar.minLength && textValue.length < textVar.minLength) {
          validationError = `Too short (min ${textVar.minLength})`;
        } else if (textVar.maxLength && textValue.length > textVar.maxLength) {
          validationError = `Too long (max ${textVar.maxLength})`;
        } else if (textVar.pattern) {
          const regex = new RegExp(textVar.pattern);
          if (!regex.test(textValue)) {
            validationError = "Pattern mismatch";
          }
        }
        break;
      }
      case "NUMBER": {
        const numberVar = variable as Graphql.TemplateNumberVariable;
        const numValue =
          typeof value === "number"
            ? value
            : typeof value === "string"
              ? parseFloat(value)
              : Number(value);
        if (isNaN(numValue)) {
          validationError = "Invalid number";
        } else if (
          numberVar.minValue !== null &&
          numberVar.minValue !== undefined &&
          numValue < numberVar.minValue
        ) {
          validationError = `Too low (min ${numberVar.minValue})`;
        } else if (
          numberVar.maxValue !== null &&
          numberVar.maxValue !== undefined &&
          numValue > numberVar.maxValue
        ) {
          validationError = `Too high (max ${numberVar.maxValue})`;
        }
        break;
      }
      case "DATE": {
        const dateVar = variable as Graphql.TemplateDateVariable;
        const dateValue =
          value instanceof Date ? value : new Date(String(value));
        if (isNaN(dateValue.getTime())) {
          validationError = "Invalid date";
        } else if (dateVar.minDate && dateValue < new Date(dateVar.minDate)) {
          validationError = "Date too early";
        } else if (dateVar.maxDate && dateValue > new Date(dateVar.maxDate)) {
          validationError = "Date too late";
        }
        break;
      }
      case "SELECT": {
        const selectVar = variable as Graphql.TemplateSelectVariable;
        const values = Array.isArray(value) ? value : [value];
        const options = selectVar.options || [];
        for (const selectedValue of values) {
          if (!options.includes(selectedValue as string)) {
            validationError = "Invalid selection";
            break;
          }
        }
        if (!selectVar.multiple && values.length > 1) {
          validationError = "Multiple selection not allowed";
        }
        break;
      }
    }

    if (validationError) {
      invalidFields.push(
        `${variable.name || `Variable ${variable.id}`}: ${validationError}`
      );
    }
  }

  if (missingFields.length > 0 && invalidFields.length > 0) {
    return `Missing: ${missingFields.join(", ")}. Invalid: ${invalidFields.join(", ")}`;
  } else if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  } else if (invalidFields.length > 0) {
    return `Invalid values: ${invalidFields.join(", ")}`;
  }

  return "Not ready";
};

// View mode renderer (ready status is always view-only)
const ReadyStatusViewRenderer = React.memo<{
  column: EditableColumn;
  cellValue: Graphql.RecipientWithVariableValues;
}>(({ column, cellValue }) => {
  // Extract and memoize variables from column metadata
  const variables = useMemo(
    () => (column.metadata as { variables: Graphql.TemplateVariable[] })?.variables || [],
    [column.metadata]
  );

  // Memoize variableValues
  const variableValues = useMemo(
    () => cellValue.variableValues || {},
    [cellValue.variableValues]
  );

  // Calculate ready status (memoized)
  const isReady = useMemo(
    () => isRecipientReady(variableValues as Record<string, unknown>, variables),
    [variableValues, variables]
  );

  // Calculate tooltip message (memoized)
  const tooltipMessage = useMemo(
    () => getTooltipMessage(isReady, variables, variableValues as Record<string, unknown>),
    [isReady, variables, variableValues]
  );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Tooltip title={tooltipMessage} arrow placement="top">
        <IconButton
          size="small"
          sx={{
            padding: 0,
            color: isReady ? "success.main" : "error.main",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          {isReady ? (
            <CheckCircle fontSize="small" />
          ) : (
            <Cancel fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
});

ReadyStatusViewRenderer.displayName = "ReadyStatusViewRenderer";

// Main component (ready status is always view-only, no edit mode)
const ReadyStatusCellRenderer = React.forwardRef<
  HTMLInputElement,
  ReadyStatusCellRendererProps
>(({ column, cellValue }, _ref) => {
  // Ready status is always in view mode
  return <ReadyStatusViewRenderer column={column} cellValue={cellValue} />;
});

ReadyStatusCellRenderer.displayName = "ReadyStatusCellRenderer";

export default ReadyStatusCellRenderer;
