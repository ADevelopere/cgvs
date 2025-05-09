"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import countries, { CountryType } from "@/utils/country";
import CountryTranslations from "@/locale/components/Country";
import useAppTranslation from "@/locale/useAppTranslation";

// Type definition for the component props
export type CountrySelectProps = {
    country?: CountryType;
    setCountry: (countryType: CountryType) => void;
    autoComplete?: string;
    fullWidth?: boolean;
    required?: boolean;
    label?: string;
    onBlur?: () => void;
    style?: React.CSSProperties;
};

/**
 * Retrieves the country name by its code.
 * @param {CountryTranslations} strings - The language strings for countries.
 * @param {string} code - The country code.
 * @returns {string} The country name.
 */
function countryNameByCode(strings: CountryTranslations, code: string): string {
    return strings[code] || code;
}

/**
 * CountrySelect component allows users to select a country from a dropdown list.
 * @param {CountrySelectProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered CountrySelect component.
 */
const CountrySelect: React.FC<CountrySelectProps> = ({
    country,
    setCountry,
    autoComplete = "country",
    fullWidth,
    required,
    label,
    onBlur,
    style,
}: CountrySelectProps): React.ReactNode => {
    // Translation strings for country names
    const strings = useAppTranslation("countryTranslations");

    return (
        <Autocomplete
            fullWidth={fullWidth}
            options={countries}
            autoHighlight
            value={country}
            sx={{ ...style }}
            onChange={(_, newValue) => {
                if (newValue) {
                    setCountry(newValue);
                }
            }}
            onBlur={onBlur}
            getOptionLabel={(option) => countryNameByCode(strings, option.code)}
            renderOption={(
                props: React.HTMLAttributes<HTMLLIElement> & { key: any },
                option: CountryType,
            ) => {
                // key is extracted from props to prevent it from being passed to the DOM
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { key, ...optionProps } = props;
                return (
                    <Box
                        key={option.code}
                        component="li"
                        sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                        {...optionProps}
                    >
                        <img
                            loading="lazy"
                            width="20"
                            height="15"
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            alt=""
                        />
                        {countryNameByCode(strings, option.code)}
                    </Box>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label ?? strings.selectCountry}
                    required={required}
                    onBlur={onBlur}
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                            autoComplete: { autoComplete },
                        },
                    }}
                />
            )}
        />
    );
};

export default CountrySelect;
