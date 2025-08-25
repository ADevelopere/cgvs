import React from "react";
import { TextField, Box, useTheme, styled } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import { TextFieldProps } from "./types";

const StyledTextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== "width",
})<{ width?: string | number }>(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        transition: "all 0.3s ease",
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
            "& .MuiOutlinedInput-notchedOutline": {
                // borderColor and borderWidth will be set inline for dynamic color
            },
        },
        "&.Mui-focused": {
            backgroundColor: theme.palette.background.paper,
            transform: "scale(1.02)",
            "& .MuiOutlinedInput-notchedOutline": {
                // borderColor and borderWidth will be set inline for dynamic color
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
            // color will be set inline for dynamic color
        },
    },
}));

const TextFieldComponent: React.FC<TextFieldProps> = ({
    label,
    value,
    error,
    helperText,
    placeholder,
    required = false,
    disabled = false,
    width,
    type = "text",
    onValueChange,
    onBlur,
}) => {
    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange(e.target.value);
    };

    const getBorderColor = () => {
        if (type === "email") {
            return theme.palette.secondary.main;
        }
        return theme.palette.primary.main;
    };

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
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                variant="outlined"
                size="small"
                fullWidth
                required={required}
                disabled={disabled}
                type={type}
                error={!!error}
                helperText={error || helperText}
                placeholder={placeholder}
                aria-describedby={error ? `${label}-error` : undefined}
                width={width}
                // Inline style overrides for dynamic border and label color
                sx={{
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: getBorderColor(),
                            borderWidth: "2px",
                        },
                    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                            borderColor: getBorderColor(),
                            borderWidth: "2px",
                        },
                    "& .MuiInputLabel-root.Mui-focused": {
                        color: getBorderColor(),
                    },
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

export default TextFieldComponent;
