import React, { useMemo } from "react";
import { Tooltip, Box, IconButton } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { isRecipientReady } from "@/client/views/template/manage/data/utils/validation";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { RecipientVariableDataTranslation, useAppTranslation } from "@/client/locale";

interface ReadyStatusViewRendererProps {
  variableValues: Record<string, unknown>;
  variables: Graphql.TemplateVariable[];
}

// Get tooltip message for ready status
const getTooltipMessage = (
  isReady: boolean,
  variables: Graphql.TemplateVariable[],
  variableValues: Record<string, unknown>,
  strings: RecipientVariableDataTranslation
): string => {
  if (isReady) {
    return strings.allRequiredFieldsComplete;
  }

  const requiredVariables = variables.filter(variable => variable.required);
  const missingFields: string[] = [];
  const invalidFields: string[] = [];

  for (const variable of requiredVariables) {
    const value = variableValues[variable.id?.toString() || ""];
    const varName = variable.name || strings.variableWithId.replace("{id}", String(variable.id));

    // Check if value exists
    if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
      missingFields.push(varName);
      continue;
    }

    // Check if value passes validation
    let validationError: string | null = null;

    switch (variable.type) {
      case "TEXT": {
        const textVar = variable as Graphql.TemplateTextVariable;
        const textValue = typeof value === "string" ? value : String(value);
        if (textVar.minLength && textValue.length < textVar.minLength) {
          validationError = strings.textTooShort.replace("{min}", String(textVar.minLength));
        } else if (textVar.maxLength && textValue.length > textVar.maxLength) {
          validationError = strings.textTooLong.replace("{max}", String(textVar.maxLength));
        } else if (textVar.pattern) {
          const regex = new RegExp(textVar.pattern);
          if (!regex.test(textValue)) {
            validationError = strings.patternMismatch;
          }
        }
        break;
      }
      case "NUMBER": {
        const numberVar = variable as Graphql.TemplateNumberVariable;
        const numValue =
          typeof value === "number" ? value : typeof value === "string" ? parseFloat(value) : Number(value);
        if (isNaN(numValue)) {
          validationError = strings.invalidNumber;
        } else if (numberVar.minValue !== null && numberVar.minValue !== undefined && numValue < numberVar.minValue) {
          validationError = strings.numberTooLow.replace("{min}", String(numberVar.minValue));
        } else if (numberVar.maxValue !== null && numberVar.maxValue !== undefined && numValue > numberVar.maxValue) {
          validationError = strings.numberTooHigh.replace("{max}", String(numberVar.maxValue));
        }
        break;
      }
      case "DATE": {
        const dateVar = variable as Graphql.TemplateDateVariable;
        const dateValue = value instanceof Date ? value : new Date(String(value));
        if (isNaN(dateValue.getTime())) {
          validationError = strings.invalidDate;
        } else if (dateVar.minDate && dateValue < new Date(dateVar.minDate)) {
          validationError = strings.dateTooEarly.replace("{min}", new Date(dateVar.minDate).toLocaleDateString());
        } else if (dateVar.maxDate && dateValue > new Date(dateVar.maxDate)) {
          validationError = strings.dateTooLate.replace("{max}", new Date(dateVar.maxDate).toLocaleDateString());
        }
        break;
      }
      case "SELECT": {
        const selectVar = variable as Graphql.TemplateSelectVariable;
        const values = Array.isArray(value) ? value : [value];
        const options = selectVar.options || [];
        for (const selectedValue of values) {
          if (!options.includes(selectedValue as string)) {
            validationError = strings.invalidSelection;
            break;
          }
        }
        if (!selectVar.multiple && values.length > 1) {
          validationError = strings.multipleSelectionNotAllowed;
        }
        break;
      }
    }

    if (validationError) {
      invalidFields.push(`${varName}: ${validationError}`);
    }
  }

  if (missingFields.length > 0 && invalidFields.length > 0) {
    return strings.missingAndInvalidFields
      .replace("{missing}", missingFields.join(", "))
      .replace("{invalid}", invalidFields.join(", "));
  } else if (missingFields.length > 0) {
    return strings.missingRequiredFields.replace("{fields}", missingFields.join(", "));
  } else if (invalidFields.length > 0) {
    return strings.invalidValues.replace("{fields}", invalidFields.join(", "));
  }

  return strings.notReady;
};

/**
 * ReadyStatusViewRenderer Component
 *
 * Displays a validation status icon (CheckCircle or Cancel) with a tooltip
 * showing detailed validation results for template variable values.
 */
export const ReadyStatusViewRenderer: React.FC<ReadyStatusViewRendererProps> = ({ variableValues, variables }) => {
  const { recipientVariableDataTranslations: strings } = useAppTranslation();
  // Calculate ready status (memoized)
  const isReady = useMemo(
    () => isRecipientReady(variableValues, variables, strings),
    [variableValues, variables, strings]
  );

  // Calculate tooltip message (memoized)
  const tooltipMessage = useMemo(
    () => getTooltipMessage(isReady, variables, variableValues, strings),
    [isReady, variables, variableValues, strings]
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
          {isReady ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ReadyStatusViewRenderer;
