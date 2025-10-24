import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
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
  DateFilterOperation,
  operationRequiresValue,
  type DateFilterValue,
} from "@/client/types/filters";
import { Check, Clear } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export interface DateFilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: string;
  columnLabel: string;
  value: FilterClause<DateFilterValue, DateFilterOperation> | null;
  onApply: (
    filterClause: FilterClause<DateFilterValue, DateFilterOperation>
  ) => void;
  onClear: () => void;
}

/**
 * DateFilterPopover Component
 *
 * A reusable filter popover for date columns with various filter operations.
 */
export const DateFilterPopover: React.FC<DateFilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  columnId,
  columnLabel,
  value,
  onApply,
  onClear,
}) => {
  const [operation, setOperation] = useState<DateFilterOperation>(
    value?.operation || DateFilterOperation.is
  );
  const [startDate, setStartDate] = useState<Date | null>(
    value?.value?.start ? new Date(value.value.start) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    value?.value?.end ? new Date(value.value.end) : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setOperation(value.operation);
      setStartDate(value.value?.start ? new Date(value.value.start) : null);
      setEndDate(value.value?.end ? new Date(value.value.end) : null);
    } else {
      setOperation(DateFilterOperation.is);
      setStartDate(null);
      setEndDate(null);
    }
    setError(null);
  }, [value, open]);

  const handleOperationChange = useCallback(
    (event: SelectChangeEvent<DateFilterOperation>) => {
      const newOperation = event.target.value as DateFilterOperation;
      setOperation(newOperation);
      if (!operationRequiresValue(newOperation)) {
        setStartDate(null);
        setEndDate(null);
      }
      setError(null);
    },
    []
  );

  const valueRequired = useMemo(
    () => operationRequiresValue(operation),
    [operation]
  );

  const handleApply = useCallback(() => {
    if (valueRequired) {
      if (!startDate) {
        setError("Date is required for this operation");
        return;
      }
      if (operation === DateFilterOperation.between && !endDate) {
        setError("End date is required for between operation");
        return;
      }
      if (
        operation === DateFilterOperation.between &&
        startDate &&
        endDate &&
        startDate > endDate
      ) {
        setError("Start date must be before end date");
        return;
      }
    }

    const filterValue: DateFilterValue = {
      start: startDate?.toISOString(),
      end: endDate?.toISOString(),
    };

    const filterClause: FilterClause<DateFilterValue, DateFilterOperation> = {
      columnId,
      operation,
      ...(valueRequired ? { value: filterValue } : {}),
    };
    onApply(filterClause);
    onClose();
  }, [
    onApply,
    columnId,
    onClose,
    operation,
    startDate,
    endDate,
    valueRequired,
  ]);

  const handleClear = useCallback(() => {
    onClear();
    setOperation(DateFilterOperation.is);
    setStartDate(null);
    setEndDate(null);
    setError(null);
    onClose();
  }, [onClear, onClose]);

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
          <InputLabel id="date-filter-operation-label">Operation</InputLabel>
          <Select
            labelId="date-filter-operation-label"
            value={operation}
            onChange={handleOperationChange}
            label="Operation"
            size="small"
          >
            <MenuItem value={DateFilterOperation.is}>Is</MenuItem>
            <MenuItem value={DateFilterOperation.isNot}>Is Not</MenuItem>
            <MenuItem value={DateFilterOperation.before}>Before</MenuItem>
            <MenuItem value={DateFilterOperation.after}>After</MenuItem>
            <MenuItem value={DateFilterOperation.between}>Between</MenuItem>
            <MenuItem value={DateFilterOperation.isEmpty}>Is Empty</MenuItem>
            <MenuItem value={DateFilterOperation.isNotEmpty}>
              Is Not Empty
            </MenuItem>
          </Select>
        </FormControl>

        {valueRequired && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label={
                  operation === DateFilterOperation.between
                    ? "Start Date"
                    : "Date"
                }
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: !!error && !startDate,
                  },
                }}
              />
            </Box>

            {operation === DateFilterOperation.between && (
              <Box sx={{ mt: 2 }}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  slotProps={{
                    textField: {
                      size: "small",
                      fullWidth: true,
                      error: !!error && !endDate,
                    },
                  }}
                />
              </Box>
            )}

            {error && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block" }}
              >
                {error}
              </Typography>
            )}
          </LocalizationProvider>
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

export default DateFilterPopover;
