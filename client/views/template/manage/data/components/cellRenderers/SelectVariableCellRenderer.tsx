/**
 * @deprecated This file is no longer used after the Table refactor to renderer-based architecture.
 * It will be removed during manual cleanup. Do not use in new code.
 * See client/components/Table/renderers/ for replacement components.
 */

"use client";

import React from "react";
import {
  Autocomplete,
  TextField,
  Tooltip,
  Box,
  Typography,
  Chip,
  IconButton,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
} from "@mui/material";
import { Clear } from "@mui/icons-material";
import { EditableColumn } from "@/client/components/Table/types/column.type";
import { DataCellState } from "@/client/components/Table/TableBody/DataCell";

// Props for the main component
type SelectVariableCellRendererProps = {
  column: EditableColumn;
  cellValue: string | string[] | null | undefined;
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

// Format select value for display
const formatSelectForDisplay = (
  value: string | string[] | null | undefined
): string => {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "";
  }

  return value;
};

// View mode renderer
const SelectViewRenderer: React.FC<{
  column: EditableColumn;
  cellValue: string | string[] | null | undefined;
}> = ({ column, cellValue }) => {
  const displayValue = formatSelectForDisplay(cellValue);
  const isMultiple = column.multiple || false;
  const values = Array.isArray(cellValue)
    ? cellValue
    : cellValue
      ? [cellValue]
      : [];

  if (isMultiple && values.length > 0) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          maxHeight: "40px",
          overflow: "hidden",
        }}
      >
        {values.slice(0, 2).map((value, index) => (
          <Chip
            key={index}
            label={value}
            size="small"
            sx={{
              height: "20px",
              fontSize: "0.75rem",
            }}
          />
        ))}
        {values.length > 2 && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              alignSelf: "center",
            }}
          >
            +{values.length - 2} more
          </Typography>
        )}
      </Box>
    );
  }

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
const SelectEditRenderer = React.forwardRef<
  HTMLInputElement,
  Omit<SelectVariableCellRendererProps, "cellValue">
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
    const [isOpen, setIsOpen] = React.useState(false);
    const isMultiple = column.multiple || false;
    const options = column.options || [];
    const currentValue = state.editingValue as
      | string
      | string[]
      | null
      | undefined;

    // Convert to array format for Autocomplete
    const value = isMultiple
      ? Array.isArray(currentValue)
        ? currentValue.map(v => ({ label: v, value: v }))
        : currentValue
          ? [{ label: currentValue, value: currentValue }]
          : []
      : Array.isArray(currentValue)
        ? currentValue[0]
          ? { label: currentValue[0], value: currentValue[0] }
          : null
        : currentValue
          ? { label: currentValue, value: currentValue }
          : null;

    const handleChange = (
      event: React.SyntheticEvent,
      newValue:
        | { label: string; value: string }
        | { label: string; value: string }[]
        | null
    ) => {
      // Convert Autocomplete format back to simple string/string[] format
      const convertedValue = isMultiple
        ? Array.isArray(newValue)
          ? newValue.map(item => item.value)
          : []
        : newValue && !Array.isArray(newValue)
          ? newValue.value
          : null;

      const validationError = validateValue(convertedValue);
      setState(prev => ({
        ...prev,
        editingValue: convertedValue,
        errorMessage: validationError,
      }));
    };

    const handleClear = () => {
      const clearedValue = isMultiple ? [] : null;
      const validationError = validateValue(clearedValue);
      setState(prev => ({
        ...prev,
        editingValue: clearedValue,
        errorMessage: validationError,
      }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Only trigger commit on Enter if dropdown is closed
      if (e.key === "Enter" && !isOpen) {
        handleInputKeyDown(e);
      } else if (e.key === "Escape") {
        handleInputKeyDown(e);
      }
    };

    return (
      <Tooltip
        open={!!state.errorMessage}
        title={state.errorMessage ?? ""}
        arrow
        placement="bottom-start"
      >
        <Box sx={{ position: "relative", width: "100%" }}>
          <Autocomplete
            multiple={isMultiple}
            options={options}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onOpen={() => setIsOpen(true)}
            onClose={() => setIsOpen(false)}
            getOptionLabel={option => option?.label || ""}
            isOptionEqualToValue={(option, value) =>
              option?.value === value?.value
            }
            renderInput={params => (
              <TextField
                {...params}
                {...commonProps}
                inputRef={ref}
                error={state.errorMessage !== null}
                helperText={state.errorMessage}
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
                    padding: "4px 8px",
                  },
                  "& .MuiInputBase-input": {
                    height: "100%",
                    padding: "4px 0",
                  },
                }}
              />
            )}
            renderTags={(
              value: { label: string; value: string }[],
              getTagProps: (params: { index: number }) => object
            ) =>
              value.map(
                (option: { label: string; value: string }, index: number) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option.label}
                    size="small"
                    sx={{ height: "20px", fontSize: "0.75rem" }}
                  />
                )
              )
            }
            sx={{
              "& .MuiAutocomplete-root": {
                height: "100%",
              },
            }}
          />
          {value &&
            (isMultiple
              ? (value as { label: string; value: string }[]).length > 0
              : value) && (
              <IconButton
                size="small"
                onClick={handleClear}
                sx={{
                  position: "absolute",
                  right: "4px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  height: "20px",
                  width: "20px",
                  zIndex: 1,
                }}
              >
                <Clear fontSize="small" />
              </IconButton>
            )}
        </Box>
      </Tooltip>
    );
  }
);

SelectEditRenderer.displayName = "SelectEditRenderer";

// Main component
const SelectVariableCellRenderer = React.forwardRef<
  HTMLInputElement,
  SelectVariableCellRendererProps
>(({ column, cellValue, state, ...rest }, ref) => {
  if (!state.isEditing) {
    return <SelectViewRenderer column={column} cellValue={cellValue} />;
  }

  return (
    <SelectEditRenderer {...rest} column={column} state={state} ref={ref} />
  );
});

SelectVariableCellRenderer.displayName = "SelectVariableCellRenderer";

export default SelectVariableCellRenderer;
