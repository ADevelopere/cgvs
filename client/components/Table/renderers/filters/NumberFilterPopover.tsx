import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
} from '@mui/material';
import {
  type FilterClause,
  NumberFilterOperation,
  operationRequiresValue,
} from '@/client/types/filters';
import { Check, Clear } from '@mui/icons-material';

export interface NumberFilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnId: string;
  columnLabel: string;
  value: FilterClause<number, NumberFilterOperation> | null;
  onApply: (filterClause: FilterClause<number, NumberFilterOperation>) => void;
  onClear: () => void;
}

/**
 * NumberFilterPopover Component
 *
 * A reusable filter popover for number columns with various filter operations.
 * Provides UI for selecting operation type (equals, greater than, less than, etc.)
 * and entering numeric filter values.
 */
export const NumberFilterPopover: React.FC<NumberFilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  columnId,
  columnLabel,
  value,
  onApply,
  onClear,
}) => {
  const [operation, setOperation] = useState<NumberFilterOperation>(
    value?.operation || NumberFilterOperation.equals
  );
  const [filterValue, setFilterValue] = useState<string>(
    value?.value !== undefined ? String(value.value) : ''
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      setOperation(value.operation);
      setFilterValue(value.value !== undefined ? String(value.value) : '');
    } else {
      setOperation(NumberFilterOperation.equals);
      setFilterValue('');
    }
    setError(null);
  }, [value, open]);

  const handleOperationChange = useCallback(
    (event: SelectChangeEvent<NumberFilterOperation>) => {
      const newOperation = event.target.value as NumberFilterOperation;
      setOperation(newOperation);
      if (!operationRequiresValue(newOperation)) {
        setFilterValue('');
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
    if (valueRequired) {
      if (!filterValue.trim()) {
        setError('Value is required for this operation');
        return;
      }
      const numValue = Number(filterValue);
      if (isNaN(numValue)) {
        setError('Please enter a valid number');
        return;
      }
    }

    const filterClause: FilterClause<number, NumberFilterOperation> = {
      columnId,
      operation,
      ...(valueRequired ? { value: Number(filterValue) } : {}),
    };
    onApply(filterClause);
    onClose();
  }, [onApply, columnId, onClose, operation, filterValue, valueRequired]);

  const handleClear = useCallback(() => {
    onClear();
    setOperation(NumberFilterOperation.equals);
    setFilterValue('');
    setError(null);
    onClose();
  }, [onClear, onClose]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleApply();
      } else if (event.key === 'Escape') {
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
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={{ p: 2, minWidth: 300 }}>
        <Typography variant="subtitle2" gutterBottom>
          Filter: {columnLabel}
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="number-filter-operation-label">Operation</InputLabel>
          <Select
            labelId="number-filter-operation-label"
            value={operation}
            onChange={handleOperationChange}
            label="Operation"
            size="small"
          >
            <MenuItem value={NumberFilterOperation.equals}>Equals (=)</MenuItem>
            <MenuItem value={NumberFilterOperation.notEquals}>Not Equals (≠)</MenuItem>
            <MenuItem value={NumberFilterOperation.greaterThan}>Greater Than (&gt;)</MenuItem>
            <MenuItem value={NumberFilterOperation.greaterThanOrEqual}>Greater Than or Equal (≥)</MenuItem>
            <MenuItem value={NumberFilterOperation.lessThan}>Less Than (&lt;)</MenuItem>
            <MenuItem value={NumberFilterOperation.lessThanOrEqual}>Less Than or Equal (≤)</MenuItem>
            <MenuItem value={NumberFilterOperation.isEmpty}>Is Empty</MenuItem>
            <MenuItem value={NumberFilterOperation.isNotEmpty}>Is Not Empty</MenuItem>
          </Select>
        </FormControl>

        {valueRequired && (
          <TextField
            fullWidth
            size="small"
            label="Value"
            type="number"
            value={filterValue}
            onChange={handleValueChange}
            onKeyDown={handleKeyDown}
            error={!!error}
            helperText={error}
            sx={{ mt: 2 }}
            autoFocus
          />
        )}

        <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
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

export default NumberFilterPopover;

