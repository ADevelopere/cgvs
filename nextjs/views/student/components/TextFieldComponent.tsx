import React, { useCallback } from "react";
import { TextField, Box, styled, useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { TextFieldProps } from "./types";

const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== "width" && prop !== "colorType",
})<{ width?: string | number; colorType: "text" | "email" }>(({
    theme,
    colorType,
}) => {
    const focusColor =
        colorType === "email"
            ? theme.palette.secondary.main
            : theme.palette.primary.main;

    return {
        "& .MuiOutlinedInput-root": {
            transition: "all 0.3s ease",
            backgroundColor: theme.palette.background.paper,
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: focusColor,
                borderWidth: "2px",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: focusColor,
                borderWidth: "2px",
            },
            "&.Mui-focused": {
                backgroundColor: theme.palette.action.hover,
                transform: "scale(1.02)",
            },
            "&.Mui-error": {
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.error.main,
                },
            },
            "&.Mui-disabled": {
                backgroundColor: theme.palette.action.disabledBackground,
            },
        },
        "& .MuiInputLabel-root": {
            "&.Mui-focused": {
                color: focusColor,
            },
        },
    };
});

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

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            const valueToPass = newValue === "" ? undefined : newValue;
            const validationError = getIsValid?.(valueToPass) ?? null;
            onValueChange(valueToPass, validationError);
        },
        [getIsValid, onValueChange],
    );

    return (
        <Box sx={{ position: "relative", width }}>
            <StyledTextField
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
                required={required}
                disabled={disabled}
                type={type}
                error={!!errorMessage}
                helperText={errorMessage || helperText}
                placeholder={placeholder}
                aria-describedby={errorMessage ? `${label}-error` : undefined}
                width={width}
                colorType={type}
            />
        </Box>
    );
};

export default TextFieldComponent;
