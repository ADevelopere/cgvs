import React, { useCallback, useMemo, useState, useRef } from "react";
import { Box, useTheme, Popover, Button, Typography } from "@mui/material";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { arEG, enUS } from "date-fns/locale";
import { useAppTheme } from "@/client/contexts";
import { DateFieldProps } from "./types";
import { createStyledTextField } from "./StyledBaseField";
import { useAppTranslation } from "@/client/locale";

const DateFieldComponent: React.FC<DateFieldProps> = ({
  value,
  errorMessage,
  label,
  helperText,
  placeholder,
  required = false,
  disabled = false,
  width,
  onValueChange,
  onBlur,
  getIsValid,
}) => {
  const theme = useTheme();
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useAppTheme();

  const locale = useMemo(() => {
    if (language === "ar") return arEG;
    return enUS;
  }, [language]);

  const StyledDateField = useMemo(
    () => createStyledTextField(theme.palette.info.main),
    [theme.palette.info.main]
  );

  const { studentTranslations: strings } = useAppTranslation();

  const dateValue = useMemo(() => {
    if (!value) return null;
    const date = typeof value === "string" ? new Date(value) : value;
    return isNaN(date.getTime()) ? null : date;
  }, [value]);

  const [editValue, setEditValue] = useState<Date | null>(dateValue);
  const [error, setError] = useState<string | null>(null);

  const handleOpenPicker = useCallback(() => {
    if (!disabled) {
      setEditValue(dateValue);
      setError(null);
      setIsOpen(true);
    }
  }, [disabled, dateValue]);

  const handleChange = useCallback(
    (newValue: Date | null) => {
      setEditValue(newValue);

      if (newValue && !isNaN(newValue.getTime())) {
        const validationError = getIsValid?.(newValue) ?? null;
        setError(validationError);
      } else {
        setError("Invalid date");
      }
    },
    [getIsValid]
  );

  const handleConfirm = useCallback(() => {
    if (!editValue || isNaN(editValue.getTime())) {
      setError("Invalid date");
      return;
    }

    const validationError = getIsValid?.(editValue) ?? null;
    if (validationError) {
      setError(validationError);
      return;
    }

    // Convert date to YYYY-MM-DD format for consistency
    const dateString = editValue.toISOString().split("T")[0];
    onValueChange(dateString, null);
    setIsOpen(false);
    onBlur?.();
  }, [editValue, getIsValid, onValueChange, onBlur]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    setError(null);
    onBlur?.();
  }, [onBlur]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        handleCancel();
      }
    },
    [handleCancel]
  );

  const displayValue = dateValue ? dateValue.toLocaleDateString() : "";

  return (
    <Box sx={{ position: "relative", width }}>
      <Box ref={anchorRef} onClick={handleOpenPicker}>
        <StyledDateField
          label={label}
          value={displayValue}
          variant="outlined"
          size="small"
          fullWidth
          required={required}
          disabled={disabled}
          error={!!errorMessage}
          helperText={errorMessage ?? helperText}
          placeholder={placeholder}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              readOnly: true,
              sx: { cursor: disabled ? "default" : "pointer" },
            },
          }}
        />
      </Box>

      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={handleCancel}
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
              disabled={disabled}
              displayStaticWrapperAs="desktop"
              slotProps={{
                actionBar: {
                  actions: [],
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
              <Button onClick={handleCancel} disabled={disabled}>
                {strings.cancel}
              </Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                disabled={disabled || !!error || !editValue}
              >
                {strings.confirm}
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>
      </Popover>
    </Box>
  );
};

export default DateFieldComponent;
