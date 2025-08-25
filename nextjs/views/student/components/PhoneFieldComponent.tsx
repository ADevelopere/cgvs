import React from "react";
import { Box, useTheme, styled } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import { MuiTelInput } from "mui-tel-input";
import { BaseFieldProps } from "./types";
import { preferredCountries } from "@/utils/country";

const StyledMuiTelInput = styled(MuiTelInput)(({ theme }) => ({
    "& .MuiInputBase-root": {
        margin: 0,
        width: "100%",
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
        transition: "all 0.3s ease",
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.info.light,
                borderWidth: "2px",
            },
        },
        "&.Mui-focused": {
            backgroundColor: theme.palette.background.paper,
            transform: "scale(1.02)",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.info.light,
                borderWidth: "2px",
            },
        },
        "&.Mui-error": {
            backgroundColor: `${theme.palette.error.main}10`,
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.error.main,
            },
        },
        "&.Mui-disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
        },
    },
    "& .MuiInputBase-input": {
        paddingBlock: 1,
        paddingInline: 2,
        width: "100%",
    },
    "& .MuiInputLabel-root": {
        "&.Mui-focused": {
            color: theme.palette.info.light,
        },
    },
}));

const PhoneFieldComponent: React.FC<BaseFieldProps<string>> = ({
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

    const handleChange = (newValue: string) => {
        onValueChange(newValue);
    };

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
                error={!!error}
                helperText={error || helperText}
                placeholder={placeholder}
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

export default PhoneFieldComponent;
