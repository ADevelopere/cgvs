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
  DateFilterOperation,
  type DateFilterValue,
  operationRequiresValue,
} from "@/types/filters";
import { Check, Clear } from "@mui/icons-material";
import { useTableDataContext } from "../Table/TableDataContext";

// Labels for date filter operations
const dateFilterOperationLabels: Record<DateFilterOperation, string> = {
  [DateFilterOperation.BETWEEN]: "Between",
  [DateFilterOperation.IS]: "Is",
  [DateFilterOperation.IS_NOT]: "Is not",
  [DateFilterOperation.IS_AFTER]: "Is after",
  [DateFilterOperation.IS_BEFORE]: "Is before",
  [DateFilterOperation.IS_ON_OR_AFTER]: "Is on or after",
  [DateFilterOperation.IS_ON_OR_BEFORE]: "Is on or before",
  [DateFilterOperation.IS_EMPTY]: "Is empty",
  [DateFilterOperation.IS_NOT_EMPTY]: "Is not empty",
};

interface DateFilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: string;
  columnLabel: string;
  activeFilter: FilterClause<DateFilterValue, DateFilterOperation> | null;
}

const DateFilterPopover: React.FC<DateFilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  columnId,
  columnLabel,
  activeFilter,
}) => {
  const { applyDateFilter, clearFilter } =
    useTableDataContext();
  // Initialize state with active filter or defaults
  const [operation, setOperation] = useState<DateFilterOperation>(
    activeFilter?.operation || DateFilterOperation.IS
  );
  const [fromDate, setFromDate] = useState<string>(
    activeFilter?.value?.from ? formatDateForInput(activeFilter.value.from) : ""
  );
  const [toDate, setToDate] = useState<string>(
    activeFilter?.value?.to ? formatDateForInput(activeFilter.value.to) : ""
  );
  const [error, setError] = useState<string | null>(null);

  // Helper function to format date for input field
  function formatDateForInput(date: string | Date | null): string {
    if (!date) return "";

    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return "";

    return dateObj.toISOString().split("T")[0];
  }

  // Update state when active filter changes
  useEffect(() => {
    if (activeFilter) {
      setOperation(activeFilter.operation);
      setFromDate(
        activeFilter.value?.from
          ? formatDateForInput(activeFilter.value.from)
          : ""
      );
      setToDate(
        activeFilter.value?.to ? formatDateForInput(activeFilter.value.to) : ""
      );
    } else {
      setOperation(DateFilterOperation.IS);
      setFromDate("");
      setToDate("");
    }
    setError(null);
  }, [activeFilter, open]);

  const handleOperationChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newOperation = event.target.value as DateFilterOperation;
    setOperation(newOperation);

    // Clear values if the operation doesn't require them
    if (!operationRequiresValue(newOperation)) {
      setFromDate("");
      setToDate("");
    }

    setError(null);
  };

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
    setError(null);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
    setError(null);
  };

  const handleApply = () => {
    // Validate input for operations that require values
    if (operationRequiresValue(operation)) {
      if (operation === DateFilterOperation.BETWEEN) {
        if (!fromDate && !toDate) {
          setError("At least one date is required");
          return;
        }
      } else if (!fromDate) {
        setError("Date is required for this operation");
        return;
      }
    }

    // Create filter value
    const filterValue: DateFilterValue = {};
    if (fromDate) filterValue.from = fromDate;
    if (toDate) filterValue.to = toDate;

    // Create filter clause
    const filterClause: FilterClause<DateFilterValue, DateFilterOperation> = {
      columnId,
      operation,
      ...(operationRequiresValue(operation) ? { value: filterValue } : {}),
    };

    applyDateFilter(filterClause);
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
  const showBothDates = operation === DateFilterOperation.BETWEEN;
  const showSingleDate = valueRequired && !showBothDates;

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
            {Object.values(DateFilterOperation).map((op) => (
              <MenuItem key={op} value={op}>
                {dateFilterOperationLabels[op]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {showSingleDate && (
          <TextField
            variant="outlined"
            size="small"
            label="Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={handleFromDateChange}
            onKeyDown={handleKeyDown}
            fullWidth
            autoFocus
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
          />
        )}

        {showBothDates && (
          <>
            <TextField
              variant="outlined"
              size="small"
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={handleFromDateChange}
              onKeyDown={handleKeyDown}
              fullWidth
              autoFocus
              sx={{ mb: 2 }}
              error={!!error && !fromDate && !toDate}
              helperText={error && !fromDate && !toDate ? error : ""}
            />
            <TextField
              variant="outlined"
              size="small"
              label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={handleToDateChange}
              onKeyDown={handleKeyDown}
              fullWidth
              sx={{ mb: 2 }}
            />
          </>
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
              Clear
            </Button>
          ) : (
            <Button variant="text" size="small" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Check />}
            onClick={handleApply}
            disabled={
              valueRequired &&
              ((showBothDates && !fromDate && !toDate) ||
                (showSingleDate && !fromDate))
            }
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default DateFilterPopover;
