import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Popover,
  type SelectChangeEvent,
} from "@mui/material";
import {
  type FilterClause,
  TextFilterOperation,
  operationRequiresValue,
} from "@/client/types/filters";
import { Check, Clear } from "@mui/icons-material";

export interface TextFilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: string;
  columnLabel: string;
  value: FilterClause<string, TextFilterOperation> | null;
  onApply: (filterClause: FilterClause<string, TextFilterOperation>) => void;
  onClear: () => void;
}

/**
 * TextFilterPopover Component
 *
 * A reusable filter popover for text columns with various filter operations.
 * Provides UI for selecting operation type (contains, equals, starts with, etc.)
 * and entering filter value.
 */
export const TextFilterPopover: React.FC<TextFilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  columnId,
  columnLabel,
  value,
  onApply,
  onClear,
}) => {
  const [operation, setOperation] = useState<TextFilterOperation>(
    value?.operation || TextFilterOperation.contains
  );
  const [filterValue, setFilterValue] = useState<string>(value?.value || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setOperation(value.operation);
      setFilterValue(value.value || "");
    } else {
      setOperation(TextFilterOperation.contains);
      setFilterValue("");
    }
    setError(null);
  }, [value, open]);

  const handleOperationChange = useCallback(
    (event: SelectChangeEvent<TextFilterOperation>) => {
      const newOperation = event.target.value as TextFilterOperation;
      setOperation(newOperation);
      if (!operationRequiresValue(newOperation)) {
        setFilterValue("");
      }
      setError(null);
    },
    []
  );

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterValue(event.target.value);
      setError(null);
    },
    []
  );

  const valueRequired = useMemo(
    () => operationRequiresValue(operation),
    [operation]
  );

  const handleApply = useCallback(() => {
    if (valueRequired && !filterValue.trim()) {
      setError("Value is required for this operation");
      return;
    }
    const filterClause: FilterClause<string, TextFilterOperation> = {
      columnId,
      operation,
      ...(valueRequired ? { value: filterValue } : {}),
    };
    onApply(filterClause);
    onClose();
  }, [onApply, columnId, onClose, operation, filterValue, valueRequired]);

  const handleClear = useCallback(() => {
    onClear();
    setOperation(TextFilterOperation.contains);
    setFilterValue("");
    setError(null);
    onClose();
  }, [onClear, onClose]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleApply();
      } else if (event.key === "Escape") {
        onClose();
      }
    },
    [handleApply, onClose]
  );

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Box sx={{ p: 2, minWidth: 300 }}>
        <Typography variant="subtitle2" gutterBottom>
          Filter: {columnLabel}
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="text-filter-operation-label">Operation</InputLabel>
          <Select
            labelId="text-filter-operation-label"
            value={operation}
            onChange={handleOperationChange}
            label="Operation"
            size="small"
          >
            <MenuItem value={TextFilterOperation.contains}>Contains</MenuItem>
            <MenuItem value={TextFilterOperation.notContains}>
              Does Not Contain
            </MenuItem>
            <MenuItem value={TextFilterOperation.equals}>Equals</MenuItem>
            <MenuItem value={TextFilterOperation.notEquals}>
              Not Equals
            </MenuItem>
            <MenuItem value={TextFilterOperation.startsWith}>
              Starts With
            </MenuItem>
            <MenuItem value={TextFilterOperation.endsWith}>Ends With</MenuItem>
            <MenuItem value={TextFilterOperation.isEmpty}>Is Empty</MenuItem>
            <MenuItem value={TextFilterOperation.isNotEmpty}>
              Is Not Empty
            </MenuItem>
          </Select>
        </FormControl>

        {valueRequired && (
          <TextField
            fullWidth
            size="small"
            label="Value"
            value={filterValue}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error}
            sx={{ mt: 2 }}
            autoFocus
          />
        )}

        <Box
          sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "flex-end" }}
        >
          <Button
            size="small"
            onClick={handleClear}
            startIcon={<Clear />}
            color="inherit"
          >
            Clear
          </Button>
          <Button
            size="small"
            onClick={handleApply}
            variant="contained"
            startIcon={<Check />}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default TextFilterPopover;
