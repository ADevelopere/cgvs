import React, { useState, useCallback, useEffect } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export interface DateEditRendererProps {
  value: Date | string | null | undefined;
  onSave: (value: string) => Promise<void>;
  onCancel: () => void;
  validator?: (value: Date) => string | null;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
}

/**
 * DateEditRenderer Component
 *
 * Date picker for editing date values in table cells.
 */
export const DateEditRenderer: React.FC<DateEditRendererProps> = ({
  value,
  onSave,
  onCancel,
  validator,
  minDate,
  maxDate,
}) => {
  const initialDate = React.useMemo(() => {
    if (!value) return null;
    const date = typeof value === "string" ? new Date(value) : value;
    return isNaN(date.getTime()) ? null : date;
  }, [value]);

  const [editValue, setEditValue] = useState<Date | null>(initialDate);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const validateDate = useCallback(
    (date: Date | null): { valid: boolean; error?: string } => {
      if (!date || isNaN(date.getTime())) {
        return { valid: false, error: "Invalid date" };
      }

      if (minDate && date < minDate) {
        return {
          valid: false,
          error: `Date must be after ${minDate.toLocaleDateString()}`,
        };
      }

      if (maxDate && date > maxDate) {
        return {
          valid: false,
          error: `Date must be before ${maxDate.toLocaleDateString()}`,
        };
      }

      if (validator) {
        const validationError = validator(date);
        if (validationError) {
          return { valid: false, error: validationError };
        }
      }

      return { valid: true };
    },
    [minDate, maxDate, validator]
  );

  const handleChange = useCallback(
    (newValue: Date | null) => {
      setEditValue(newValue);

      const validation = validateDate(newValue);
      setError(validation.error || null);
    },
    [validateDate]
  );

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    const validation = validateDate(editValue);
    if (!validation.valid || !editValue) {
      setError(validation.error || "Invalid date");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(editValue.toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setIsSaving(false);
    }
  }, [editValue, onSave, validateDate, isSaving]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (!error && editValue) {
          handleSave();
        }
      }
    },
    [onCancel, error, editValue, handleSave]
  );

  useEffect(() => {
    // Auto-save on blur handled by DatePicker's onClose
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={editValue}
        onChange={handleChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={isSaving}
        slotProps={{
          textField: {
            size: "small",
            variant: "standard",
            fullWidth: true,
            error: !!error,
            helperText: error,
            onKeyDown: handleKeyDown,
            onBlur: handleSave,
            InputProps: {
              disableUnderline: !error,
            },
            sx: {
              "& .MuiInputBase-input": {
                padding: 0,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateEditRenderer;
