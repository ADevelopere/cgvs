import React, { useState } from "react";
import {
    TextField,
    Box,
    useTheme,
    MenuItem,
    styled,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Error as ErrorIcon, Clear as ClearIcon } from "@mui/icons-material";
import { GenderFieldProps } from "./types";
import { Gender } from "@/graphql/generated/types";

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        transition: "all 0.3s ease",
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.warning.main,
                borderWidth: "2px",
            },
        },
        "&.Mui-focused": {
            backgroundColor: theme.palette.background.paper,
            transform: "scale(1.02)",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.warning.main,
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
            color: theme.palette.warning.main,
        },
    },
}));

const GenderFieldComponent: React.FC<GenderFieldProps> = ({
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

    const [value, setValue] = useState<Gender | undefined>(undefined);
    const [error, setError] = useState<string | null | undefined>(null);
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as Gender | undefined;
        let validationError: string | null | undefined = null;
        if (value !== null && value !== undefined) {
            validationError = getIsValid?.(value) ?? null;
        }
        setValue(value);
        setError(validationError);
        onValueChange(value, !validationError);
    };

    return (
        <Box sx={{ position: "relative", width }}>
            <StyledTextField
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
                error={!!error}
                helperText={error || helperText}
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
                                        setValue(undefined);
                                        setError(null);
                                        onValueChange(undefined, true);
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
                {options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </StyledTextField>
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

export default GenderFieldComponent;
