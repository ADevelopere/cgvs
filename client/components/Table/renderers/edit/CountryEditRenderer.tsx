import React, { useState, useCallback } from "react";
import { Box, Autocomplete, TextField } from "@mui/material";
import Image from "next/image";
import countries, { CountryType } from "@/client/lib/country";
import { useAppTranslation } from "@/client/locale";
import { CountryCode } from "@/client/graphql/generated/gql/graphql";

export interface CountryEditRendererProps {
  value: CountryCode | null | undefined;
  /**
   * Callback to save the new value
   * This is provided by DataCell and ultimately calls column.onUpdate
   * Call this when the user confirms their edit
   */
  onSave: (value: CountryCode) => Promise<void>;
  /**
   * Callback to cancel editing without saving
   * This exits edit mode and discards changes
   */
  onCancel: () => void;
  validator?: (value: CountryCode) => string | null;
}

/**
 * CountryEditRenderer Component
 *
 * Autocomplete with country flags for editing country values in table cells.
 * Supports validation, auto-focus, and keyboard navigation.
 */
export const CountryEditRenderer: React.FC<CountryEditRendererProps> = ({
  value,
  onSave,
  onCancel,
  validator,
}) => {
  const countryStrings = useAppTranslation("countryTranslations");
  const [selectedCountry, setSelectedCountry] = useState<CountryType | null>(
    value ? countries.find(c => c.code === value) || null : null
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    (_event: unknown, newValue: CountryType | null) => {
      setSelectedCountry(newValue);

      // Validate on change
      if (newValue && validator) {
        const validationError = validator(newValue.code);
        setError(validationError);
      } else {
        setError(null);
      }
    },
    [validator]
  );

  const handleSave = useCallback(async () => {
    if (isSaving || !selectedCountry) return;

    // Final validation
    if (validator) {
      const validationError = validator(selectedCountry.code);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSave(selectedCountry.code);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setIsSaving(false);
    }
  }, [selectedCountry, onSave, validator, isSaving]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!error && selectedCountry) {
          handleSave();
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    },
    [handleSave, onCancel, error, selectedCountry]
  );

  const handleBlur = useCallback(() => {
    if (!error && !isSaving && selectedCountry) {
      handleSave();
    }
  }, [handleSave, error, isSaving, selectedCountry]);

  return (
    <Autocomplete
      fullWidth
      options={countries}
      openOnFocus
      autoHighlight
      value={selectedCountry}
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={isSaving}
      getOptionLabel={option => countryStrings[option.code] || option.code}
      renderOption={(props, option) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { key, ...optionProps } = props;
        return (
          <Box
            key={option.code}
            component="li"
            sx={{ "& > img": { mr: 1, flexShrink: 0 } }}
            {...optionProps}
          >
            <Image
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
              width={20}
              height={15}
              style={{ objectFit: "cover" }}
              loading="lazy"
            />
            {countryStrings[option.code] || option.code}
          </Box>
        );
      }}
      renderInput={params => (
        <TextField
          {...params}
          error={!!error}
          helperText={error}
          size="small"
          variant="standard"
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              autoComplete: "off",
            },
            htmlInput: {
              ...params.inputProps,
            },
          }}
          sx={{
            "& .MuiInputBase-input": {
              padding: 0,
            },
          }}
        />
      )}
    />
  );
};

export default CountryEditRenderer;
