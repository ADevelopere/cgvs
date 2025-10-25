import React, { useState, useCallback, useEffect } from "react";
import { Box, Autocomplete, TextField } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Image from "next/image";
import countries, { CountryType } from "@/client/lib/country";
import { useAppTranslation } from "@/client/locale";
import { CountryCode } from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";

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

  const [inputValue, setInputValue] = useState("");

  const [error, setError] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    logger.debug("CountryEditRenderer mounted", {
      totalCountries: countries.length,
      first5Countries: countries.slice(0, 5),
      selectedCountry,
      inputValue,
      value,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = useCallback(
    (_event: unknown, newValue: CountryType | null) => {
      if (!newValue) return; // Don't allow null selection

      setSelectedCountry(newValue);

      let validationError: string | null = null;
      // Validate on change
      if (validator) {
        validationError = validator(newValue.code);
        setError(validationError);
      } else {
        setError(null);
      }

      // Save immediately on selection (like old implementation)
      if (!validator || !validationError) {
        // Early return if value hasn't changed
        if (newValue.code === value) {
          onCancel();
          return;
        }

        // Exit edit mode immediately
        onCancel();

        // Save in the background (fire and forget)
        onSave(newValue.code).catch(() => {
          // Error handling is done by the parent component
        });
      }
    },
    [validator, value, onCancel, onSave]
  );

  const handleSave = useCallback(async () => {
    if (!selectedCountry) return;

    // Early return if value hasn't changed
    if (selectedCountry.code === value) {
      onCancel();
      return;
    }

    // Final validation
    if (validator) {
      const validationError = validator(selectedCountry.code);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Exit edit mode immediately
    onCancel();

    // Save in the background (fire and forget)
    onSave(selectedCountry.code).catch(() => {
      // Error handling is done by the parent component
    });
  }, [selectedCountry, onSave, validator, value, onCancel]);

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

  const handleClickAway = useCallback(() => {
    logger.debug("ClickAway triggered", { error, selectedCountry });
    if (!error && selectedCountry) {
      handleSave();
    }

    onCancel();
  }, [handleSave, error, selectedCountry, onCancel]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Autocomplete
          fullWidth
          options={countries}
          autoHighlight
          openOnFocus
          value={selectedCountry}
          onChange={handleChange}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          onOpen={() => logger.debug("Autocomplete opened")}
          getOptionLabel={option => countryStrings[option.code] || option.code}
          renderOption={(props, option) => {
            const { key: _key, ...optionProps } = props;
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
              focused={true}
              autoFocus={true}
              error={!!error}
              helperText={error}
              size="small"
              variant="standard"
              onKeyDown={handleKeyDown}
              slotProps={{
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
      </div>
    </ClickAwayListener>
  );
};

export default CountryEditRenderer;
