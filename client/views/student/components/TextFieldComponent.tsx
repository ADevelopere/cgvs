import React, { useCallback, useMemo } from "react";
import { Box, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { TextFieldProps } from "./types";
import { createStyledTextField } from "./StyledBaseField";

const TextFieldComponent: React.FC<TextFieldProps> = ({
  value,
  errorMessage,
  label,
  helperText,
  placeholder,
  required = false,
  disabled = false,
  width,
  type = "text",
  onValueChange,
  onBlur,
  getIsValid,
}) => {
  const theme = useTheme();

  const StyledComponent = useMemo(() => {
    const focusColor =
      type === "email"
        ? theme.palette.secondary.main
        : theme.palette.primary.main;
    return createStyledTextField(focusColor);
  }, [type, theme.palette.primary.main, theme.palette.secondary.main]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const valueToPass = newValue === "" ? undefined : newValue;
      const validationError = getIsValid?.(valueToPass) ?? null;
      onValueChange(valueToPass, validationError);
    },
    [getIsValid, onValueChange]
  );

  return (
    <Box sx={{ position: "relative", width }}>
      <StyledComponent
        label={
          required ? (
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {label}
              <Typography
                component="span"
                sx={{
                  color: theme.palette.error.main,
                  fontWeight: "bold",
                }}
              >
                *
              </Typography>
            </Box>
          ) : (
            label
          )
        }
        value={value ?? ""}
        onChange={handleChange}
        onBlur={onBlur}
        variant="outlined"
        size="small"
        fullWidth
        disabled={disabled}
        type={type}
        error={!!errorMessage}
        helperText={errorMessage || helperText}
        placeholder={placeholder}
        aria-describedby={errorMessage ? `${label}-error` : undefined}
        sx={{
          width: width || "100%",
        }}
      />
    </Box>
  );
};

export default TextFieldComponent;
