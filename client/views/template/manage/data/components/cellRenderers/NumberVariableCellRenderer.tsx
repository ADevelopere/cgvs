/**
 * @deprecated This file is no longer used after the Table refactor to renderer-based architecture.
 * It will be removed during manual cleanup. Do not use in new code.
 * See client/components/Table/renderers/ for replacement components.
 */

"use client";

import React from "react";
import {
  TextField,
  Tooltip,
  Box,
  Typography,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
} from "@mui/material";
import { EditableColumn } from "@/client/components/Table/table.type";
import { DataCellState } from "@/client/components/Table/TableBody/DataCell";

// Props for the main component
type NumberVariableCellRendererProps = {
  column: EditableColumn;
  cellValue: number | string | null | undefined;
  state: DataCellState;
  setState: React.Dispatch<React.SetStateAction<DataCellState>>;
  commonProps:
    | FilledTextFieldProps
    | OutlinedTextFieldProps
    | StandardTextFieldProps;
  validateValue: (value: unknown) => string | null;
  handleInputKeyDown: (e: React.KeyboardEvent) => void;
  handleBlur: () => void;
};

// Format number for display
const formatNumberForDisplay = (
  value: number | string | null | undefined,
  decimalPlaces?: number
): string => {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "";
  }

  if (decimalPlaces !== null && decimalPlaces !== undefined) {
    return numValue.toFixed(decimalPlaces);
  }

  return numValue.toString();
};

// View mode renderer
const NumberViewRenderer: React.FC<{
  column: EditableColumn;
  cellValue: number | string | null | undefined;
}> = ({ column, cellValue }) => {
  const displayValue = formatNumberForDisplay(cellValue, column.decimalPlaces);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        textAlign: "right",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: displayValue ? "text.primary" : "text.disabled",
          fontStyle: displayValue ? "normal" : "italic",
        }}
      >
        {displayValue || "—"}
      </Typography>
    </Box>
  );
};

// Edit mode renderer
const NumberEditRenderer = React.forwardRef<
  HTMLInputElement,
  Omit<NumberVariableCellRendererProps, "cellValue">
>(
  (
    {
      column,
      state,
      setState,
      commonProps,
      validateValue,
      handleBlur,
      handleInputKeyDown,
    },
    ref
  ) => {
    const inputValue = (state.editingValue as string) ?? "";
    const decimalPlaces = column.decimalPlaces;
    const minValue = column.minValue;
    const maxValue = column.maxValue;

    // Calculate step based on decimal places
    const step =
      decimalPlaces !== null && decimalPlaces !== undefined
        ? Math.pow(10, -decimalPlaces)
        : 0.01;

    return (
      <Tooltip
        open={!!state.errorMessage}
        title={state.errorMessage ?? ""}
        arrow
        placement="bottom-start"
      >
        <TextField
          {...commonProps}
          inputRef={ref}
          type="number"
          value={inputValue}
          onChange={e => {
            const value = e.target.value;
            const validationError = validateValue(value);
            setState(prev => ({
              ...prev,
              editingValue: value,
              errorMessage: validationError,
            }));
          }}
          onBlur={handleBlur}
          onKeyDown={handleInputKeyDown}
          fullWidth
          error={state.errorMessage !== null}
          helperText={state.errorMessage}
          inputProps={{
            step,
            min: minValue || undefined,
            max: maxValue || undefined,
          }}
          FormHelperTextProps={{
            sx: {
              position: "absolute",
              bottom: "-20px",
              left: 0,
              right: 0,
            },
          }}
          sx={{
            "& .MuiInputBase-root": {
              height: "100%",
            },
            "& .MuiInputBase-input": {
              height: "100%",
              padding: "8px 12px",
              textAlign: "right",
            },
          }}
        />
      </Tooltip>
    );
  }
);

NumberEditRenderer.displayName = "NumberEditRenderer";

// Main component
const NumberVariableCellRenderer = React.forwardRef<
  HTMLInputElement,
  NumberVariableCellRendererProps
>(({ column, cellValue, state, ...rest }, ref) => {
  if (!state.isEditing) {
    return <NumberViewRenderer column={column} cellValue={cellValue} />;
  }

  return (
    <NumberEditRenderer {...rest} column={column} state={state} ref={ref} />
  );
});

NumberVariableCellRenderer.displayName = "NumberVariableCellRenderer";

export default NumberVariableCellRenderer;
