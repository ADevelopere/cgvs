import React, { useState, useCallback, useRef, useEffect } from "react";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Popover, Button, Box, Typography } from "@mui/material";
import { arEG, enUS } from "date-fns/locale";
import { useAppTheme } from "@/client/contexts";
import { useTableLocale } from "../../contexts";
export interface DateEditRendererProps {
  value: Date | string | null | undefined;
  /**
   * Callback to save the new value
   * This is provided by DataCell and ultimately calls column.onUpdate
   * Call this when the user confirms their edit
   */
  onSave: (value: string) => Promise<void>;
  /**
   * Callback to cancel editing without saving
   * This exits edit mode and discards changes
   */
  onCancel: () => void;
  validator?: (value: Date) => string | null;
  minDate?: Date;
  maxDate?: Date;
  format?: string;
}

/**
 * DateEditRenderer Component
 *
 * Static date picker with confirm/cancel buttons in a popover.
 * Opens automatically when entering edit mode.
 */
export const DateEditRenderer: React.FC<DateEditRendererProps> = ({
  value,
  onSave,
  onCancel,
  validator,
  minDate,
  maxDate,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useAppTheme();
  const locale = React.useMemo(() => {
    if (language === "ar") return arEG;
    return enUS;
  }, [language]);

  const {
    strings: { general: generalStrings, validation: validationStrings },
  } = useTableLocale();

  const initialDate = React.useMemo(() => {
    if (!value) return null;
    const date = typeof value === "string" ? new Date(value) : value;
    return isNaN(date.getTime()) ? null : date;
  }, [value]);

  const [editValue, setEditValue] = useState<Date | null>(initialDate);
  const [error, setError] = useState<string | null>(null);

  // Open popover after component mounts and ref is set
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const validateDate = useCallback(
    (date: Date | null): { valid: boolean; error?: string } => {
      if (!date || isNaN(date.getTime())) {
        return { valid: false, error: validationStrings.invalidDate };
      }

      if (minDate && date < minDate) {
        return {
          valid: false,
          error: validationStrings.minDate(minDate.toLocaleDateString()),
        };
      }

      if (maxDate && date > maxDate) {
        return {
          valid: false,
          error: validationStrings.maxDate(maxDate.toLocaleDateString()),
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
    [minDate, maxDate, validator, validationStrings]
  );

  const handleChange = useCallback(
    (newValue: Date | null) => {
      setEditValue(newValue);

      const validation = validateDate(newValue);
      setError(validation.error || null);
    },
    [validateDate]
  );

  const handleConfirm = useCallback(async () => {
    const validation = validateDate(editValue);
    if (!validation.valid || !editValue) {
      setError(validation.error || validationStrings.invalidDate);
      return;
    }

    const originalDate = initialDate;

    // Check if newValue is null (empty)
    if (editValue === null && !originalDate) {
      // If original value is null or undefined, cancel (no change to make)
      onCancel();
      return;
    }

    // Early return if value hasn't changed
    if (originalDate && editValue.getTime() === originalDate.getTime()) {
      onCancel();
      return;
    }

    // Close popover and exit edit mode immediately
    setIsOpen(false);
    onCancel();

    // Save in the background (fire and forget)
    onSave(editValue.toISOString()).catch(() => {
      // Error handling is done by the parent component
    });
  }, [
    editValue,
    onSave,
    validateDate,
    initialDate,
    onCancel,
    validationStrings,
  ]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      }
    },
    [onCancel]
  );

  useEffect(() => {
    // Add global keydown listener for Escape
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [onCancel]);

  return (
    <>
      {/* Anchor element for the popover - fills the entire cell */}
      <Box
        ref={anchorRef}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Typography variant="body2">
          {editValue ? editValue.toLocaleDateString() : "Select date..."}
        </Typography>
      </Box>

      {/* Popover with StaticDatePicker */}
      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={onCancel}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            onKeyDown: handleKeyDown,
          },
        }}
      >
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={locale}
        >
          <Box sx={{ p: 2 }}>
            <StaticDatePicker
              value={editValue}
              onChange={handleChange}
              minDate={minDate}
              maxDate={maxDate}
              displayStaticWrapperAs="desktop"
              slotProps={{
                actionBar: {
                  actions: [], // Remove default action bar, we'll add our own
                },
              }}
            />

            {/* Error message */}
            {error && (
              <Typography
                color="error"
                variant="caption"
                sx={{ display: "block", mt: 1, px: 1 }}
              >
                {error}
              </Typography>
            )}

            {/* Custom action buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
                pt: 2,
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              <Button onClick={onCancel}>{generalStrings.cancel}</Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                disabled={!!error || !editValue}
              >
                {generalStrings.confirm}
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Popover>
    </>
  );
};

export default DateEditRenderer;
