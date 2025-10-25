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
import { useTableLocale } from "../../contexts";

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
  const {
    strings: { filter: filterStrings, dateFilterOps },
  } = useTableLocale();

  const [operation, setOperation] = useState<DateFilterOperation>(
    value?.operation || DateFilterOperation.is
  );
  const [startDate, setStartDate] = useState<Date | null>(
    value?.value?.from ? new Date(value.value.from) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    value?.value?.to ? new Date(value.value.to) : null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setOperation(value.operation);
      setStartDate(value.value?.from ? new Date(value.value.from) : null);
      setEndDate(value.value?.to ? new Date(value.value.to) : null);
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
        setError(filterStrings.dateRequired);
        return;
      }
      if (operation === DateFilterOperation.between && !endDate) {
        setError(filterStrings.endDateRequired);
        return;
      }
      if (
        operation === DateFilterOperation.between &&
        startDate &&
        endDate &&
        startDate > endDate
      ) {
        setError(filterStrings.startDateBeforeEnd);
        return;
      }
    }

    const filterValue: DateFilterValue = {
      from: startDate?.toISOString(),
      to: endDate?.toISOString(),
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
    filterStrings.dateRequired,
    filterStrings.endDateRequired,
    filterStrings.startDateBeforeEnd,
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
          {filterStrings.title}: {columnLabel}
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="date-filter-operation-label">
            {filterStrings.operation}
          </InputLabel>
          <Select
            labelId="date-filter-operation-label"
            value={operation}
            onChange={handleOperationChange}
            label={filterStrings.operation}
            size="small"
          >
            <MenuItem value={DateFilterOperation.is}>
              {dateFilterOps.is}
            </MenuItem>
            <MenuItem value={DateFilterOperation.isNot}>
              {dateFilterOps.isNot}
            </MenuItem>
            <MenuItem value={DateFilterOperation.isBefore}>
              {dateFilterOps.isBefore}
            </MenuItem>
            <MenuItem value={DateFilterOperation.isAfter}>
              {dateFilterOps.isAfter}
            </MenuItem>
            <MenuItem value={DateFilterOperation.between}>
              {dateFilterOps.between}
            </MenuItem>
            <MenuItem value={DateFilterOperation.isEmpty}>
              {dateFilterOps.isEmpty}
            </MenuItem>
            <MenuItem value={DateFilterOperation.isNotEmpty}>
              {dateFilterOps.isNotEmpty}
            </MenuItem>
          </Select>
        </FormControl>

        {valueRequired && (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label={
                  operation === DateFilterOperation.between
                    ? filterStrings.startDate
                    : filterStrings.date
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
                  label={filterStrings.endDate}
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
            {filterStrings.clear}
          </Button>
          <Button
            size="small"
            onClick={handleApply}
            variant="contained"
            startIcon={<Check />}
          >
            {filterStrings.apply}
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default DateFilterPopover;
