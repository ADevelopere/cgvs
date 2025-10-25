import React, { useState, useCallback } from "react";
import { TextField, MenuItem, InputAdornment, IconButton } from "@mui/material";
import { Clear as ClearIcon } from "@mui/icons-material";

export interface SelectEditRendererProps<TValue> {
  value: TValue | null | undefined;
  options: Array<{ label: string; value: TValue | null | undefined }>;
  /**
   * Callback to save the new value
   * This is provided by DataCell and ultimately calls column.onUpdate
   * Call this when the user confirms their edit
   */
  onSave: (value: TValue | null | undefined) => Promise<void>;
  /**
   * Callback to cancel editing without saving
   * This exits edit mode and discards changes
   */
  onCancel: () => void;
}

/**
 * SelectEditRenderer Component
 *
 * Select dropdown that opens automatically and saves immediately on selection.
 * Uses TextField with select prop for better MUI integration.
 */
export const SelectEditRenderer = <TValue extends string | number | null | undefined = string | number | null | undefined>({
  value,
  options,
  onSave,
  onCancel,
}: SelectEditRendererProps<TValue>): React.JSX.Element => {
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isSaving) return;

      const newValueString = event.target.value;
      const normalizedOldValue = (value || "") as string;

      // Only save if the value has actually changed
      if (newValueString === normalizedOldValue) {
        return;
      }

      setIsSaving(true);

      try {
        // Convert string back to TValue and save
        await onSave(newValueString as unknown as TValue);
        // Don't set isSaving(false) here - component unmounts after successful save
      } catch (_err) {
        // Error handling - only reset isSaving on error (component stays mounted)
        setIsSaving(false);
      }
    },
    [onSave, isSaving, value]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      }
    },
    [onCancel]
  );

  const handleClose = useCallback(() => {
    // If user closes the menu without selecting, cancel edit mode
    if (!isSaving) {
      onCancel();
    }
  }, [isSaving, onCancel]);

  const handleClear = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      if (isSaving) return;

      setIsSaving(true);

      try {
        await onSave(null);
        // Don't set isSaving(false) here - component unmounts after successful save
      } catch (_err) {
        // Error handling - only reset isSaving on error (component stays mounted)
        setIsSaving(false);
      }
    },
    [onSave, isSaving]
  );

  return (
    <TextField
      select
      fullWidth
      variant="standard"
      value={(value || "") as string}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={isSaving}
      autoFocus
      slotProps={{
        select: {
          open: true, // Open menu automatically
          onClose: handleClose,
        },
        input: {
          disableUnderline: true,
          endAdornment: value ? (
            <InputAdornment
              position="end"
              sx={{
                px: 4,
                position: "relative",
                zIndex: 1400, // Higher than MUI Menu (1300)
                pointerEvents: "auto",
              }}
            >
              <IconButton
                aria-label="clear selection"
                onClick={handleClear}
                edge="end"
                size="small"
                disabled={isSaving}
                sx={{
                  backgroundColor: "background.paper",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
      sx={{
        "& .MuiInputBase-input": {
          padding: 0,
        },
      }}
    >
      {options.map(option => (
        <MenuItem
          key={option.value as unknown as string}
          value={option.value as unknown as string}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SelectEditRenderer;
