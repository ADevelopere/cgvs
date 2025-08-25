import React, { useCallback } from "react";
import { TextField, Box, styled } from "@mui/material";
import { BaseFieldProps } from "./types";

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        transition: "all 0.3s ease",
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.info.main,
                borderWidth: "2px",
            },
        },
        "&.Mui-focused": {
            backgroundColor: theme.palette.background.paper,
            transform: "scale(1.02)",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.info.main,
                borderWidth: "2px",
            },
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
            color: theme.palette.info.main,
        },
    },
}));

const DateFieldComponent: React.FC<BaseFieldProps<string>> = ({
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
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value ?? "";
            let validationError: string | null | undefined = null;
            // Only validate if newValue is not null/empty string
            if (
                newValue !== null &&
                newValue !== undefined &&
                newValue !== ""
            ) {
                validationError = getIsValid?.(newValue) ?? null;
            }
            onValueChange(newValue, validationError);
        },
        [getIsValid, onValueChange],
    );

    return (
        <Box sx={{ position: "relative", width }}>
            <StyledTextField
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
