import React, { useState, useCallback, useEffect, useRef } from "react";
import { TextField } from "@mui/material";

export interface NumberEditRendererProps {
  value: number | null | undefined;
  onSave: (value: number) => Promise<void>;
  onCancel: () => void;
  validator?: (value: number) => string | null;
  min?: number;
  max?: number;
  step?: number;
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
  validator,
  min,
  max,
  step,
  decimals,
}) => {
  const [editValue, setEditValue] = useState(
    value !== null && value !== undefined ? String(value) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const validateNumber = useCallback(
    (strValue: string): { valid: boolean; value?: number; error?: string } => {
      if (!strValue.trim()) {
        return { valid: false, error: "Value is required" };
      }

      const numValue = Number(strValue);
      if (isNaN(numValue)) {
        return { valid: false, error: "Please enter a valid number" };
      }

      if (min !== undefined && numValue < min) {
        return { valid: false, error: `Value must be at least ${min}` };
      }

      if (max !== undefined && numValue > max) {
        return { valid: false, error: `Value must be at most ${max}` };
      }

      if (decimals !== undefined) {
        const decimalPart = strValue.split(".")[1];
        if (decimalPart && decimalPart.length > decimals) {
          return {
            valid: false,
            error: `Maximum ${decimals} decimal places allowed`,
          };
        }
      }

      if (validator) {
        const validationError = validator(numValue);
        if (validationError) {
          return { valid: false, error: validationError };
        }
      }

      return { valid: true, value: numValue };
    },
    [min, max, decimals, validator]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setEditValue(newValue);

      // Validate on change
      const validation = validateNumber(newValue);
      setError(validation.error || null);
    },
    [validateNumber]
  );

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    const validation = validateNumber(editValue);
    if (!validation.valid || validation.value === undefined) {
      setError(validation.error || "Invalid value");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(validation.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setIsSaving(false);
    }
  }, [editValue, onSave, validateNumber, isSaving]);

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

  const handleBlur = useCallback(() => {
    if (!error && !isSaving) {
      handleSave();
    }
  }, [handleSave, error, isSaving]);

  return (
    <TextField
      inputRef={inputRef}
      type="number"
      value={editValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      error={!!error}
      helperText={error}
      fullWidth
      size="small"
      variant="standard"
      disabled={isSaving}
      inputProps={{
        min,
        max,
        step:
          step ||
          (decimals !== undefined ? Math.pow(10, -decimals) : undefined),
      }}
      InputProps={{
        disableUnderline: !error,
      }}
      sx={{
        "& .MuiInputBase-input": {
          padding: 0,
        },
      }}
    />
  );
};

export default NumberEditRenderer;
