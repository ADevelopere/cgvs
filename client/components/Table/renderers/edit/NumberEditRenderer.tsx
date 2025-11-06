import React, { useState, useCallback, useEffect, useRef } from "react";
import { TextField, Tooltip } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTableLocale } from "../../contexts";

export interface NumberEditRendererProps {
  value: number | null | undefined;
  onSave: (value: number | null | undefined) => Promise<void>;
  onCancel: () => void;
  onErrorChange?: (error: string | null) => void;
  validator?: (value: number) => string | null;
  min?: number;
  max?: number;
  decimals?: number;
}

/**
 * NumberEditRenderer Component
 *
 * Number input with validation for editing numeric values in table cells.
 */
export const NumberEditRenderer: React.FC<NumberEditRendererProps> = ({
  value,
  onSave,
  onCancel,
  onErrorChange,
  validator,
  min,
  max,
  decimals,
}) => {
  const {
    strings: { validation: validationStrings },
  } = useTableLocale();

  const [editValue, setEditValue] = useState(value !== null && value !== undefined ? String(value) : "");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount and set cursor at the end
    if (inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, []);

  const validateNumber = useCallback(
    (strValue: string): { valid: boolean; value?: number | null; error?: string } => {
      const numValue = strValue ? Number(strValue) : null;
      if (numValue !== null) {
        if (isNaN(numValue)) {
          return { valid: false, error: validationStrings.invalidNumber };
        }

        if (min !== undefined && numValue < min) {
          return { valid: false, error: validationStrings.minValue(min) };
        }

        if (max !== undefined && numValue > max) {
          return { valid: false, error: validationStrings.maxValue(max) };
        }

        if (decimals !== undefined) {
          const decimalPart = strValue.split(".")[1];
          if (decimalPart && decimalPart.length > decimals) {
            return {
              valid: false,
              error: validationStrings.maxDecimals(decimals),
            };
          }
        }

        if (validator) {
          const validationError = validator(numValue);
          if (validationError) {
            return { valid: false, error: validationError };
          }
        }
      }

      return { valid: true, value: numValue };
    },
    [min, max, decimals, validator, validationStrings]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setEditValue(newValue);

      // Validate on change
      const validation = validateNumber(newValue);
      setError(validation.error || null);
      onErrorChange?.(validation.error || null);
    },
    [validateNumber, onErrorChange]
  );

  const handleSave = useCallback(async () => {
    const validation = validateNumber(editValue);
    if (!validation.valid || validation.value === undefined) {
      setError(validation.error || validationStrings.invalidValue);
      return;
    }

    const newValue = validation.value;
    const originalValue = value;

    // Check if newValue is null (empty)
    if (newValue === null && !originalValue) {
      // If original value is null or undefined, cancel (no change to make)
      onCancel();
      return;
    }

    // Early return if value hasn't changed
    if (newValue === originalValue) {
      onCancel();
      return;
    }

    // Exit edit mode immediately
    onCancel();

    // Save in the background (fire and forget)
    onSave(newValue).catch(() => {
      // Error handling is done by the parent component
    });
  }, [editValue, onSave, validateNumber, value, onCancel, validationStrings]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!error) {
          handleSave();
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    },
    [handleSave, onCancel, error]
  );

  const handleClickAway = useCallback(() => {
    if (!error) {
      handleSave();
    }
    onCancel();
  }, [handleSave, error, onCancel]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Tooltip open={!!error} title={error ?? ""} arrow placement="bottom-start">
          <TextField
            inputRef={inputRef}
            type="text"
            value={editValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            fullWidth
            size="small"
            variant="standard"
            slotProps={{
              input: {
                disableUnderline: true,
              },
              htmlInput: {
                inputMode: "decimal",
              },
            }}
            sx={{
              "& .MuiInputBase-input": {
                padding: 0,
              },
            }}
          />
        </Tooltip>
      </div>
    </ClickAwayListener>
  );
};

export default NumberEditRenderer;
