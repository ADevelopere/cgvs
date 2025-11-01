import React, { useCallback, useMemo } from "react";
import { Box, useTheme, Autocomplete } from "@mui/material";
import Image from "next/image";
import countries, { CountryType } from "@/client/lib/country";
import { useAppTranslation } from "@/client/locale";
import { BaseFieldProps } from "./types";
import { createStyledTextField } from "./StyledBaseField";
import { CountryCode } from "@/client/graphql/generated/gql/graphql";

const CountryFieldComponent: React.FC<BaseFieldProps<CountryCode>> = ({
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
  const theme = useTheme();
  const { countryTranslations: countryStrings } = useAppTranslation();

  const StyledCountryField = useMemo(
    () => createStyledTextField(theme.palette.success.main),
    [theme.palette.success.main]
  );

  const selectedCountry = useMemo(
    () => (value ? countries.find(c => c.code === value) : null),
    [value]
  );

  const handleChange = useCallback(
    (_: unknown, newValue: CountryType | null) => {
      let validationError: string | null | undefined = null;
      if (newValue !== null && newValue !== undefined) {
        validationError = getIsValid?.(newValue.code) ?? null;
      }
      if (newValue) {
        onValueChange(newValue.code, validationError);
      } else {
        // If null/undefined, always valid
        onValueChange(undefined, null);
      }
    },
    [getIsValid, onValueChange]
  );

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
        getOptionLabel={option => countryStrings[option.code] || option.code}
        renderOption={(
          props: React.HTMLAttributes<HTMLLIElement> & {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            key: any;
          },
          option: CountryType
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
        renderInput={params => (
          <StyledCountryField
            {...params}
            label={label}
            variant="outlined"
            size="small"
            required={required}
            error={!!errorMessage}
            helperText={errorMessage || helperText}
            placeholder={placeholder}
          />
        )}
      />
    </Box>
  );
};

export default CountryFieldComponent;
