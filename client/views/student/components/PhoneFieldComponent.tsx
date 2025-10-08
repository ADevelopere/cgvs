import React, { useCallback } from "react";
import { Box,  styled } from "@mui/material";
import { MuiTelInput } from "mui-tel-input";
import { BaseFieldProps } from "./types";
import { preferredCountries } from "@/client/lib/country";

const StyledMuiTelInput = styled(MuiTelInput)(({ theme }) => ({
    '& .MuiInputBase-root': {
        margin: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        transition: 'all 0.3s ease',
        backgroundColor: theme.palette.background.paper,
        minHeight: 40, // Match MUI Outlined TextField small
        boxSizing: 'border-box',
        fontSize: '0.875rem', // 14px, matches MUI small
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.info.light,
                borderWidth: '2px',
            },
        },
        '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper,
            transform: 'scale(1.02)',
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.info.light,
                borderWidth: '2px',
            },
        },
        '&.Mui-errorMessage': {
            backgroundColor: `${theme.palette.error.main}10`,
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.error.main,
            },
        },
        '&.Mui-disabled': {
            backgroundColor: theme.palette.action.disabledBackground,
        },
    },
    '& .MuiInputBase-input': {
        padding: '8.5px 14px', // Match MUI Outlined TextField small
        width: '100%',
        fontSize: '0.875rem',
        lineHeight: 1.43,
        boxSizing: 'border-box',
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': {
            color: theme.palette.info.light,
        },
    },
}));

const PhoneFieldComponent: React.FC<BaseFieldProps<string>> = ({
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
        (newValue: string) => {
            let validationError: string | null | undefined = null;
            if (newValue === "") {
                // Empty is always valid, pass null to onValueChange
                onValueChange(undefined, null);
                return;
            }
            validationError = getIsValid?.(newValue) ?? null;
            onValueChange(newValue, validationError);
        },
        [getIsValid, onValueChange],
    );

    return (
        <Box sx={{ position: "relative", width }}>
            <StyledMuiTelInput
                label={label}
                value={value}
                onChange={handleChange}
                onBlur={onBlur}
                langOfCountryName={"ar"}
                defaultCountry={"EG"}
                focusOnSelectCountry={true}
                excludedCountries={["IL"]}
                preferredCountries={preferredCountries}
                fullWidth
                required={required}
                disabled={disabled}
                error={!!errorMessage}
                helperText={errorMessage || helperText}
                placeholder={placeholder}
            />
        </Box>
    );
};

export default PhoneFieldComponent;
