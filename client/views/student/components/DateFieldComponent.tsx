import React, { useCallback, useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import { DateFieldProps } from "./types";
import { createStyledTextField } from "./StyledBaseField";

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

  const StyledDateField = useMemo(
    () => createStyledTextField(theme.palette.info.main),
    [theme.palette.info.main]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value ?? "";
      let validationError: string | null | undefined = null;
      // Only validate if newValue is not null/empty string
      if (newValue !== null && newValue !== undefined && newValue !== "") {
        // Convert string to Date for validation
        const dateValue = new Date(newValue);
        validationError = getIsValid?.(dateValue) ?? null;
      }
      onValueChange(newValue, validationError);
    },
    [getIsValid, onValueChange]
  );

  return (
    <Box sx={{ position: "relative", width }}>
      <StyledDateField
        label={label}
        value={value ?? ""}
        onChange={handleChange}
        onBlur={onBlur}
        variant="outlined"
        size="small"
        fullWidth
        required={required}
        disabled={disabled}
        type="date"
        error={!!errorMessage}
        helperText={errorMessage ?? helperText}
        placeholder={placeholder}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
    </Box>
  );
};

export default DateFieldComponent;
