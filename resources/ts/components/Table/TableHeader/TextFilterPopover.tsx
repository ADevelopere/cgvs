import type React from "react";
import { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  type FilterClause,
  TextFilterOperation,
  textFilterOperationLabels,
  operationRequiresValue,
} from "@/types/filters";
import { Check, Clear } from "@mui/icons-material";
import { useTableDataContext } from "../Table/TableDataContext";
import { useTableLocale } from "@/locale/table/TableLocaleContext";

interface TextFilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: string;
  columnLabel: string;
  activeFilter: FilterClause<string, TextFilterOperation> | null;
}

const TextFilterPopover: React.FC<TextFilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  columnId,
  columnLabel,
  activeFilter,
}) => {
  const { strings } = useTableLocale();

  const { applyTextFilter, clearFilter } = useTableDataContext();
  // Initialize state with active filter or defaults
  const [operation, setOperation] = useState<TextFilterOperation>(
    activeFilter?.operation || TextFilterOperation.CONTAINS
  );
  const [value, setValue] = useState<string>(activeFilter?.value || "");
  const [error, setError] = useState<string | null>(null);

  // Update state when active filter changes
  useEffect(() => {
    if (activeFilter) {
      setOperation(activeFilter.operation);
      setValue(activeFilter.value || "");
    } else {
      setOperation(TextFilterOperation.CONTAINS);
      setValue("");
    }
    setError(null);
  }, [activeFilter, open]);

  const handleOperationChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newOperation = event.target.value as TextFilterOperation;
    setOperation(newOperation);

    // Clear value if the operation doesn't require one
    if (!operationRequiresValue(newOperation)) {
      setValue("");
    }

    setError(null);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError(null);
  };

  const handleApply = () => {
    // Validate input
    if (operationRequiresValue(operation) && !value.trim()) {
      setError("Value is required for this operation");
      return;
    }

    // Create filter clause
    const filterClause: FilterClause<string, TextFilterOperation> = {
      columnId,
      operation,
      ...(operationRequiresValue(operation) ? { value } : {}),
    };

    applyTextFilter(filterClause);
    onClose();
  };

  const handleClear = () => {
    clearFilter(columnId);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const valueRequired = operationRequiresValue(operation);

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
          <InputLabel id={`${columnId}-operation-label`}>Operation</InputLabel>
          <Select
            labelId={`${columnId}-operation-label`}
            value={operation}
            onChange={handleOperationChange as any}
            label="Operation"
            size="small"
          >
            {Object.values(TextFilterOperation).map((op) => (
              <MenuItem key={op} value={op}>
                {textFilterOperationLabels[op]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {valueRequired && (
          <TextField
            variant="outlined"
            size="small"
            label="Value"
            placeholder="Enter filter value..."
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

export default TextFilterPopover;
