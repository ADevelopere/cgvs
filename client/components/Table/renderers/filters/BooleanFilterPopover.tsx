import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Popover,
} from "@mui/material";
import { Check, Clear } from "@mui/icons-material";

export interface BooleanFilterPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  columnLabel: string;
  value: boolean | null;
  onApply: (value: boolean | null) => void;
  onClear: () => void;
}

/**
 * BooleanFilterPopover Component
 *
 * A reusable filter popover for boolean columns with radio buttons.
 * Provides UI for selecting true, false, or all (no filter).
 */
export const BooleanFilterPopover: React.FC<BooleanFilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  columnLabel,
  value,
  onApply,
  onClear,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(
    value === null ? "all" : value ? "true" : "false"
  );

  useEffect(() => {
    setSelectedValue(value === null ? "all" : value ? "true" : "false");
  }, [value, open]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedValue(event.target.value);
    },
    []
  );

  const handleApply = useCallback(() => {
    const boolValue = selectedValue === "all" ? null : selectedValue === "true";
    onApply(boolValue);
    onClose();
  }, [onApply, selectedValue, onClose]);

  const handleClear = useCallback(() => {
    onClear();
    setSelectedValue("all");
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
      <Box sx={{ p: 2, minWidth: 250 }}>
        <Typography variant="subtitle2" gutterBottom>
          Filter: {columnLabel}
        </Typography>

        <RadioGroup
          value={selectedValue}
          onChange={handleChange}
          sx={{ mt: 2 }}
        >
          <FormControlLabel
            value="all"
            control={<Radio size="small" />}
            label="All"
          />
          <FormControlLabel
            value="true"
            control={<Radio size="small" />}
            label="True"
          />
          <FormControlLabel
            value="false"
            control={<Radio size="small" />}
            label="False"
          />
        </RadioGroup>

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

export default BooleanFilterPopover;
