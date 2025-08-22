import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import {
  type FilterClause,
  NumberFilterOperation,
  operationRequiresValue,
} from "@/types/filters";
import { Check, Clear } from "@mui/icons-material";
import { useTableDataContext } from "../Table/TableDataContext";
import { useTableLocale } from "@/locale/table/TableLocaleContext";

// Labels for number filter operations
const numberFilterOperationLabels: Record<NumberFilterOperation, string> = {
  [NumberFilterOperation.EQUALS]: "Equals",
  [NumberFilterOperation.NOT_EQUALS]: "Does not equal",
  [NumberFilterOperation.GREATER_THAN]: "Greater than",
  [NumberFilterOperation.GREATER_THAN_OR_EQUAL]: "Greater than or equal to",
  [NumberFilterOperation.LESS_THAN]: "Less than",
  [NumberFilterOperation.LESS_THAN_OR_EQUAL]: "Less than or equal to",
  [NumberFilterOperation.IS_NULL]: "Is empty",
  [NumberFilterOperation.IS_NOT_NULL]: "Is not empty",
};

interface NumberFilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: string;
  columnLabel: string;
  activeFilter: FilterClause<number, NumberFilterOperation> | null;
}

const NumberFilterPopover: React.FC<NumberFilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  columnId,
  columnLabel,
  activeFilter,
}) => {
  const { strings } = useTableLocale();

  const {
    applyNumberFilter,
    clearFilter,
  } = useTableDataContext();
  // Initialize state with active filter or defaults
  const [operation, setOperation] = useState<NumberFilterOperation>(
    activeFilter?.operation ?? NumberFilterOperation.EQUALS
  );
  const [value, setValue] = useState<string>(
    activeFilter?.value !== undefined ? String(activeFilter.value) : ""
  );
  const [error, setError] = useState<string | null>(null);

  // Update state when active filter changes
  useEffect(() => {
    if (activeFilter) {
      setOperation(activeFilter.operation);
      setValue(
        activeFilter.value !== undefined ? String(activeFilter.value) : ""
      );
    } else {
      setOperation(NumberFilterOperation.EQUALS);
      setValue("");
    }
    setError(null);
  }, [activeFilter, open]);

  const handleOperationChange = useCallback((event: SelectChangeEvent) => {
    const newOperation = event.target.value as NumberFilterOperation;
    setOperation(newOperation);

    // Clear value if the operation doesn't require one
    if (!operationRequiresValue(newOperation)) {
      setValue("");
    }

    setError(null);
  }, []);

  const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError(null);
  }, []);

  const handleApply = useCallback(() => {
    // Validate input for operations that require a value
    if (operationRequiresValue(operation)) {
      if (!value.trim()) {
        setError("Value is required for this operation");
        return;
      }

      const numValue = Number(value);
      if (isNaN(numValue)) {
        setError("Please enter a valid number");
        return;
      }
    }

    // Create filter clause
    const filterClause: FilterClause<number, NumberFilterOperation> = {
      columnId,
      operation,
      ...(operationRequiresValue(operation) ? { value: Number(value) } : {}),
    };

    applyNumberFilter(filterClause);
    onClose();
  }, [applyNumberFilter, columnId, onClose, operation, value]);

  const handleClear = useCallback(() => {
    clearFilter(columnId);
    onClose();
  }, [clearFilter, columnId, onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    } else if (e.key === "Escape") {
      onClose();
    }
  }, [handleApply, onClose]);

  const valueRequired = useMemo(() => operationRequiresValue(operation), [operation]);

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
      <Box sx={{ p: 2, width: 300 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Filter: {columnLabel}
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id={`${columnId}-operation-label`}>
            {strings.filter.operation}
          </InputLabel>
          <Select
            labelId={`${columnId}-operation-label`}
            value={operation}
            onChange={handleOperationChange}
            label={strings.filter.operation}
            size="small"
          >
            {Object.values(NumberFilterOperation).map((op) => (
              <MenuItem key={op} value={op}>
                {numberFilterOperationLabels[op]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {valueRequired && (
          <TextField
            variant="outlined"
            size="small"
            label={strings.filter.value}
            type="number"
            placeholder="Enter number value..."
            value={value}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            fullWidth
            autoFocus
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
          />
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          {activeFilter ? (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<Clear />}
              onClick={handleClear}
            >
              {strings.filter.clear}
            </Button>
          ) : (
            <Button variant="text" size="small" onClick={onClose}>
              {strings.filter.cancel}
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Check />}
            onClick={handleApply}
            disabled={valueRequired && !value.trim()}
          >
            {strings.filter.apply}
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default NumberFilterPopover;
