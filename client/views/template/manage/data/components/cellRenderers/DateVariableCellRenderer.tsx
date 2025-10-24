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
type DateVariableCellRendererProps = {
  column: EditableColumn;
  cellValue: string | Date | null | undefined;
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

// Format date for display
const formatDateForDisplay = (
  value: string | Date | null | undefined
): string => {
  if (!value) {
    return "";
  }

  const dateValue = value instanceof Date ? value : new Date(value);

  if (isNaN(dateValue.getTime())) {
    return "";
  }

  return dateValue.toLocaleDateString();
};

// Format date for input (YYYY-MM-DD)
const formatDateForInput = (
  value: string | Date | null | undefined
): string => {
  if (!value) {
    return "";
  }

  const dateValue = value instanceof Date ? value : new Date(value);

  if (isNaN(dateValue.getTime())) {
    return "";
  }

  return dateValue.toISOString().split("T")[0];
};

// View mode renderer
const DateViewRenderer: React.FC<{
  column: EditableColumn;
  cellValue: string | Date | null | undefined;
}> = ({ cellValue }) => {
  const displayValue = formatDateForDisplay(cellValue);

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
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
const DateEditRenderer = React.forwardRef<
  HTMLInputElement,
  Omit<DateVariableCellRendererProps, "cellValue">
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
    const inputValue = formatDateForInput(
      state.editingValue as string | Date | null | undefined
    );
    const minDate = column.minDate;
    const maxDate = column.maxDate;

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
          type="date"
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
            min: minDate
              ? new Date(minDate).toISOString().split("T")[0]
              : undefined,
            max: maxDate
              ? new Date(maxDate).toISOString().split("T")[0]
              : undefined,
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
            },
          }}
        />
      </Tooltip>
    );
  }
);

DateEditRenderer.displayName = "DateEditRenderer";

// Main component
const DateVariableCellRenderer = React.forwardRef<
  HTMLInputElement,
  DateVariableCellRendererProps
>(({ column, cellValue, state, ...rest }, ref) => {
  if (!state.isEditing) {
    return <DateViewRenderer column={column} cellValue={cellValue} />;
  }

  return <DateEditRenderer {...rest} column={column} state={state} ref={ref} />;
});

DateVariableCellRenderer.displayName = "DateVariableCellRenderer";

export default DateVariableCellRenderer;
