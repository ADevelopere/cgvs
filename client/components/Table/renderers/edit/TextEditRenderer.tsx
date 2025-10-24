import React, { useState, useCallback, useEffect, useRef } from "react";
import { TextField } from "@mui/material";

export interface TextEditRendererProps {
  value: string | null | undefined;
  onSave: (value: string) => Promise<void>;
  onCancel: () => void;
  validator?: (value: string) => string | null;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
}

/**
 * TextEditRenderer Component
 *
 * TextField with validation for editing text values in table cells.
 * Supports Enter to save, Escape to cancel, and optional validation.
 */
export const TextEditRenderer: React.FC<TextEditRendererProps> = ({
  value,
  onSave,
  onCancel,
  validator,
  placeholder,
  multiline = false,
  maxLength,
}) => {
  const [editValue, setEditValue] = useState(value || "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      if (maxLength && newValue.length > maxLength) {
        return; // Don't allow exceeding max length
      }
      setEditValue(newValue);

      // Validate on change
      if (validator) {
        const validationError = validator(newValue);
        setError(validationError);
      } else {
        setError(null);
      }
    },
    [validator, maxLength]
  );

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    // Final validation
    if (validator) {
      const validationError = validator(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSave(editValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setIsSaving(false);
    }
  }, [editValue, onSave, validator, isSaving]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !multiline) {
        event.preventDefault();
        if (!error) {
          handleSave();
        }
      } else if (event.key === "Escape") {
        event.preventDefault();
        onCancel();
      }
    },
    [handleSave, onCancel, error, multiline]
  );

  const handleBlur = useCallback(() => {
    if (!error && !isSaving) {
      handleSave();
    }
  }, [handleSave, error, isSaving]);

  return (
    <TextField
      inputRef={inputRef}
      value={editValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      error={!!error}
      helperText={error}
      placeholder={placeholder}
      multiline={multiline}
      fullWidth
      size="small"
      variant="standard"
      disabled={isSaving}
      InputProps={{
        disableUnderline: !error,
      }}
      sx={{
        "& .MuiInputBase-input": {
          padding: 0,
        },
      }}
    />
  );
};

export default TextEditRenderer;
