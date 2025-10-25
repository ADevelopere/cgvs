import React, { useState, useCallback, useEffect, useRef } from "react";
import { MuiTelInput } from "mui-tel-input";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { preferredCountries } from "@/client/lib/country";

export interface PhoneEditRendererProps {
  value: string | null | undefined;
  /**
   * Callback to save the new value
   * This is provided by DataCell and ultimately calls column.onUpdate
   * Call this when the user confirms their edit
   */
  onSave: (value: string) => Promise<void>;
  /**
   * Callback to cancel editing without saving
   * This exits edit mode and discards changes
   */
  onCancel: () => void;
  validator?: (value: string) => string | null;
}

/**
 * PhoneEditRenderer Component
 *
 * Phone number input with country code selector for editing phone values in table cells.
 * Uses MuiTelInput with Arabic country names and preferred countries.
 */
export const PhoneEditRenderer: React.FC<PhoneEditRendererProps> = ({
  value,
  onSave,
  onCancel,
  validator,
}) => {
  const [phoneValue, setPhoneValue] = useState(value || "");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount and set cursor at the end
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }, 100);
  }, []);

  const handleChange = useCallback(
    (newValue: string) => {
      setPhoneValue(newValue);

      // Validate on change
      if (validator) {
        const validationError = validator(newValue);
        setError(validationError);
      } else {
        setError(null);
      }
    },
    [validator]
  );

  const handleSave = useCallback(async () => {
    // Early return if value hasn't changed
    const newValue = phoneValue || null;
    const originalValue = value || null;
    if (newValue === originalValue) {
      onCancel();
      return;
    }

    // Final validation
    if (validator) {
      const validationError = validator(phoneValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Exit edit mode immediately
    onCancel();

    // Save in the background (fire and forget)
    onSave(phoneValue).catch(() => {
      // Error handling is done by the parent component
    });
  }, [phoneValue, onSave, validator, value, onCancel]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!error) {
          handleSave();
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    },
    [handleSave, onCancel, error]
  );

  const handleClickAway = useCallback(() => {
    handleSave();
    onCancel();
  }, [handleSave, onCancel]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <MuiTelInput
          inputRef={inputRef}
          value={phoneValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          langOfCountryName="ar"
          defaultCountry="EG"
          focusOnSelectCountry
          excludedCountries={["IL"]}
          preferredCountries={preferredCountries}
          fullWidth
          size="small"
          variant="standard"
          error={!!error}
          helperText={error}
          sx={{
            "& .MuiInputBase-input": {
              padding: 0,
            },
            "& .MuiInput-root:before": {
              borderBottom: error ? undefined : "none",
            },
          }}
        />
      </div>
    </ClickAwayListener>
  );
};

export default PhoneEditRenderer;
