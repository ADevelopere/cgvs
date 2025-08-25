import React from "react";
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
    value,
    error,
    helperText,
    placeholder,
    required = false,
    disabled = false,
    width,
    onValueChange,
    onBlur,
}) => {
    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(e.target.value ?? "");
    };

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