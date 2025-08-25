import React, { useCallback, useState } from "react";
import {
    TextField,
    Box,
    MenuItem,
    styled,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";
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
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value as Gender | undefined;
            let validationError: string | null | undefined = null;
            if (value !== null && value !== undefined) {
                validationError = getIsValid?.(value) ?? null;
            }
            onValueChange(value, validationError);
        },
        [getIsValid, onValueChange],
    );

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
                {options?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </StyledTextField>
        </Box>
    );
};

export default GenderFieldComponent;
