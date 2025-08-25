import React, { useCallback } from "react";
import { TextField, Box, useTheme, styled } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
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

    const [value, setValue] = React.useState<string | undefined>(undefined);
    const [error, setError] = React.useState<string | null | undefined>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value ?? "";
            const validationError = getIsValid?.(newValue) ?? null;
            setValue(newValue);
            setError(validationError);
            onValueChange(newValue);
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
                error={!!error}
                helperText={error ?? helperText}
                placeholder={placeholder}
                slotProps={{
                    inputLabel: { shrink: true },
                }}
            />
            {error && (
                <ErrorIcon
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: theme.palette.error.main,
                        fontSize: "1.2rem",
                    }}
                />
            )}
        </Box>
    );
};

export default DateFieldComponent;
