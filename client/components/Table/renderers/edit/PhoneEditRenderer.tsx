import React, { useState, useCallback, useEffect, useRef } from "react";
import { MuiTelInput } from "mui-tel-input";
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
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    setTimeout(() => {
      inputRef.current?.focus();
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
    if (isSaving) return;

    // Final validation
    if (validator) {
      const validationError = validator(phoneValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSave(phoneValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setIsSaving(false);
    }
  }, [phoneValue, onSave, validator, isSaving]);

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

  // Don't auto-save on blur - let DataCell's click outside handler manage when to exit edit mode
  // This prevents premature saving when clicking the country selector
  const handleBlur = useCallback(() => {
    // Blur is handled by DataCell's click outside logic
    // Only validate, don't save
    if (validator && phoneValue) {
      const validationError = validator(phoneValue);
      setError(validationError);
    }
  }, [validator, phoneValue]);

  return (
    <MuiTelInput
      inputRef={inputRef}
      value={phoneValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      langOfCountryName="ar"
      defaultCountry="EG"
      focusOnSelectCountry
      excludedCountries={["IL"]}
      preferredCountries={preferredCountries}
      fullWidth
      size="small"
      variant="standard"
      disabled={isSaving}
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
  );
};

export default PhoneEditRenderer;

