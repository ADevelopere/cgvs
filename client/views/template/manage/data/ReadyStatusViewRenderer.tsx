import React, { useMemo } from "react";
import { Tooltip, Box, IconButton } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { isRecipientReady } from "@/client/views/template/manage/data/utils/validation";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

interface ReadyStatusViewRendererProps {
  variableValues: Record<string, unknown>;
  variables: Graphql.TemplateVariable[];
}

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

/**
 * ReadyStatusViewRenderer Component
 *
 * Displays a validation status icon (CheckCircle or Cancel) with a tooltip
 * showing detailed validation results for template variable values.
 */
export const ReadyStatusViewRenderer: React.FC<
  ReadyStatusViewRendererProps
> = ({ variableValues, variables }) => {
  // Calculate ready status (memoized)
  const isReady = useMemo(
    () => isRecipientReady(variableValues, variables),
    [variableValues, variables]
  );

  // Calculate tooltip message (memoized)
  const tooltipMessage = useMemo(
    () => getTooltipMessage(isReady, variables, variableValues),
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
};

export default ReadyStatusViewRenderer;

