import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Popover,
} from "@mui/material";
import { Check, Clear } from "@mui/icons-material";

export interface SelectFilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnLabel: string;
  options: Array<{ label: string; value: string | number }>;
  value: (string | number)[] | null;
  onApply: (value: (string | number)[]) => void;
  onClear: () => void;
}

/**
 * SelectFilterPopover Component
 *
 * A reusable filter popover for select/dropdown columns with multi-select checkboxes.
 * Provides UI for selecting multiple options with "Select All" and "Deselect All" buttons.
 */
export const SelectFilterPopover: React.FC<SelectFilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  columnLabel,
  options,
  value,
  onApply,
  onClear,
}) => {
  const [selectedValues, setSelectedValues] = useState<Set<string | number>>(
    new Set(value || [])
  );

  useEffect(() => {
    setSelectedValues(new Set(value || []));
  }, [value, open]);

  const handleToggle = useCallback((optionValue: string | number) => {
    setSelectedValues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(optionValue)) {
        newSet.delete(optionValue);
      } else {
        newSet.add(optionValue);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedValues(new Set(options.map(opt => opt.value)));
  }, [options]);

  const handleDeselectAll = useCallback(() => {
    setSelectedValues(new Set());
  }, []);

  const handleApply = useCallback(() => {
    onApply(Array.from(selectedValues));
    onClose();
  }, [onApply, selectedValues, onClose]);

  const handleClear = useCallback(() => {
    onClear();
    setSelectedValues(new Set());
    onClose();
  }, [onClear, onClose]);

  const allSelected = selectedValues.size === options.length;
  const noneSelected = selectedValues.size === 0;

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
      <Box sx={{ p: 2, minWidth: 300, maxWidth: 400 }}>
        <Typography variant="subtitle2" gutterBottom>
          Filter: {columnLabel}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 1,
            mt: 2,
            mb: 1,
          }}
        >
          <Button
            size="small"
            onClick={handleSelectAll}
            disabled={allSelected}
            variant="outlined"
          >
            Select All
          </Button>
          <Button
            size="small"
            onClick={handleDeselectAll}
            disabled={noneSelected}
            variant="outlined"
          >
            Deselect All
          </Button>
        </Box>

        <Box
          sx={{
            maxHeight: 300,
            overflowY: "auto",
            mt: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            p: 1,
          }}
        >
          {options.map(option => (
            <FormControlLabel
              key={String(option.value)}
              control={
                <Checkbox
                  checked={selectedValues.has(option.value)}
                  onChange={() => handleToggle(option.value)}
                  size="small"
                />
              }
              label={option.label}
              sx={{
                width: "100%",
                ml: 0,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            />
          ))}
        </Box>

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
            disabled={noneSelected}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default SelectFilterPopover;
