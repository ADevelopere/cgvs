import React, { useMemo, useState } from "react";
import { TextField, Box, useTheme, Autocomplete, styled } from "@mui/material";
import { Error as ErrorIcon } from "@mui/icons-material";
import Image from "next/image";
import countries, { CountryType } from "@/utils/country";
import useAppTranslation from "@/locale/useAppTranslation";
import { BaseFieldProps } from "./types";
import { CountryCode } from "@/graphql/generated/types";

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        transition: "all 0.3s ease",
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.success.main,
                borderWidth: "2px",
            },
        },
        "&.Mui-focused": {
            backgroundColor: theme.palette.background.paper,
            transform: "scale(1.02)",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.success.main,
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
            color: theme.palette.success.main,
        },
    },
}));

const CountryFieldComponent: React.FC<BaseFieldProps<CountryCode>> = ({
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
    const countryStrings = useAppTranslation("countryTranslations");
    const [value, setValue] = useState<CountryCode | undefined>("EG");
    const [error, setError] = useState<string | null | undefined>(null);

    const selectedCountry = useMemo(
        () => countries.find((c) => c.code === value) || countries[0],
        [value],
    );

    const handleChange = (_: unknown, newValue: CountryType | null) => {
        const validationError = getIsValid?.(newValue) ?? null;
        setError(validationError);
        setValue(newValue?.code);
        if (newValue) {
            onValueChange(newValue.code);
        }
    };

    return (
        <Box sx={{ position: "relative", width }}>
            <Autocomplete
                fullWidth
                options={countries}
                autoHighlight
                disabled={disabled}
                value={selectedCountry}
                onChange={handleChange}
                onBlur={onBlur}
                getOptionLabel={(option) =>
                    countryStrings[option.code] || option.code
                }
                renderOption={(
                    props: React.HTMLAttributes<HTMLLIElement> & {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        key: any;
                    },
                    option: CountryType,
                ) => {
                    // key is extracted from props to prevent it from being passed to the DOM
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { key, ...optionProps } = props;
                    return (
                        <Box
                            key={option.code}
                            component="li"
                            sx={{
                                "& > img": {
                                    mr: 1,
                                    flexShrink: 0,
                                },
                                transition: "background-color 0.2s ease",
                                "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            }}
                            {...optionProps}
                        >
                            <Image
                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                alt=""
                                width={20}
                                height={15}
                                style={{
                                    objectFit: "cover",
                                }}
                                loading="lazy"
                            />
                            {countryStrings[option.code] || option.code}
                        </Box>
                    );
                }}
                renderInput={(params) => (
                    <StyledTextField
                        {...params}
                        label={label}
                        variant="outlined"
                        size="small"
                        required={required}
                        error={!!error}
                        helperText={error || helperText}
                        placeholder={placeholder}
                    />
                )}
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

export default CountryFieldComponent;
