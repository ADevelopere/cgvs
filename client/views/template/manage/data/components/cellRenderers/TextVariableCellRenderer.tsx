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
type TextVariableCellRendererProps = {
  column: EditableColumn;
  cellValue: string | null | undefined;
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

// View mode renderer
const TextViewRenderer: React.FC<{
  column: EditableColumn;
  cellValue: string | null | undefined;
}> = ({ column, cellValue }) => {
  const displayValue = cellValue || "";
  const maxLength = column.maxLength;
  const shouldTruncate = maxLength && displayValue.length > maxLength;

  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      <Tooltip title={shouldTruncate ? displayValue : ""} arrow placement="top">
        <Typography
          variant="body2"
          sx={{
            color: displayValue ? "text.primary" : "text.disabled",
            fontStyle: displayValue ? "normal" : "italic",
          }}
        >
          {shouldTruncate
            ? `${displayValue.substring(0, maxLength)}...`
            : displayValue || "—"}
        </Typography>
      </Tooltip>
    </Box>
  );
};

// Edit mode renderer
const TextEditRenderer = React.forwardRef<
  HTMLInputElement,
  Omit<TextVariableCellRendererProps, "cellValue">
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
    const maxLength = column.maxLength;
    const minLength = column.minLength;

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
          type="text"
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
            maxLength: maxLength || undefined,
            minLength: minLength || undefined,
            pattern: column.pattern || undefined,
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

TextEditRenderer.displayName = "TextEditRenderer";

// Main component
const TextVariableCellRenderer = React.forwardRef<
  HTMLInputElement,
  TextVariableCellRendererProps
>(({ column, cellValue, state, ...rest }, ref) => {
  if (!state.isEditing) {
    return <TextViewRenderer column={column} cellValue={cellValue} />;
  }

  return <TextEditRenderer {...rest} column={column} state={state} ref={ref} />;
});

TextVariableCellRenderer.displayName = "TextVariableCellRenderer";

export default TextVariableCellRenderer;
