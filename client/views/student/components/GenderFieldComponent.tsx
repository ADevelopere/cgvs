import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  MenuItem,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
import { GenderFieldProps } from "./types";
import { createStyledTextField } from "./StyledBaseField";
import { Gender } from "@/client/graphql/generated/gql/graphql";

const GenderFieldComponent: React.FC<GenderFieldProps> = ({
  value,
  errorMessage,
  label,
  helperText,
  placeholder,
  required = false,
  disabled = false,
  width,
  options,
  onValueChange,
  onBlur,
  getIsValid,
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  const StyledGenderField = useMemo(
    () => createStyledTextField(theme.palette.warning.main),
    [theme.palette.warning.main]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value as Gender | undefined;
      let validationError: string | null | undefined = null;
      if (value !== null && value !== undefined) {
        validationError = getIsValid?.(value) ?? null;
      }
      onValueChange(value, validationError);
    },
    [getIsValid, onValueChange]
  );

  return (
    <Box sx={{ position: "relative", width }}>
      <StyledGenderField
        select
        label={label}
        value={value ?? ""}
        onChange={handleChange}
        onBlur={onBlur}
        variant="outlined"
        size="small"
        fullWidth
        required={required}
        disabled={disabled}
        error={!!errorMessage}
        helperText={errorMessage || helperText}
        placeholder={placeholder}
        slotProps={{
          select: {
            open: open,
            onClose: () => setOpen(false),
            onOpen: () => setOpen(true),
          },
          input: {
            endAdornment: value ? (
              <InputAdornment position="start" sx={{ pr: 1 }}>
                <IconButton
                  aria-label="clear selection"
                  onClick={() => {
                    onValueChange(undefined, null);
                  }}
                  edge="end"
                  size="small"
                  disabled={disabled}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
      >
        {options?.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </StyledGenderField>
    </Box>
  );
};

export default GenderFieldComponent;
