import React, { useState, useCallback, useEffect, useRef } from "react";
import { TextField } from "@mui/material";

export interface TextEditRendererProps {
  value: string | null | undefined;
  /**
   * Callback to save the new value
   * This is provided by DataCell and ultimately calls column.onUpdate
   * Call this when the user confirms their edit (e.g., Enter key, blur)
   */
  onSave: (value: string | null) => Promise<void>;
  /**
   * Callback to cancel editing without saving
   * This exits edit mode and discards changes
   */
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount and set cursor at the end
    if (inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
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
    // Early return if value hasn't changed
    const newValue = editValue === "" ? null : editValue;
    const originalValue = value === undefined ? null : value;
    if (newValue === originalValue) {
      onCancel();
      return;
    }

    // Final validation
    if (validator) {
      const validationError = validator(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Exit edit mode immediately
    onCancel();

    // Save in the background (fire and forget)
    onSave(newValue).catch(() => {
      // Error handling is done by the parent component
    });
  }, [editValue, onSave, validator, value, onCancel]);

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
    if (!error) {
      handleSave();
    }
  }, [handleSave, error]);

  return (
    <TextField
      inputRef={inputRef}
      value={editValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onMouseDown={e => e.stopPropagation()}
      onBlur={handleBlur}
      error={!!error}
      helperText={error}
      placeholder={placeholder}
      multiline={multiline}
      fullWidth
      size="small"
      variant="standard"
      slotProps={{
        input: {
          disableUnderline: !error,
        },
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
