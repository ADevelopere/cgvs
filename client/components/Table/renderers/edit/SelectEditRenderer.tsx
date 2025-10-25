import React, { useState, useCallback, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import logger from "@/client/lib/logger";

export interface SelectEditRendererProps<TValue> {
  value: TValue;
  options: Array<{ label: string; value: TValue }>;
  /**
   * Callback to save the new value
   * This is provided by DataCell and ultimately calls column.onUpdate
   * Call this when the user confirms their edit
   */
  onSave: (value: TValue) => Promise<void>;
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
 */
export const SelectEditRenderer = <TValue,>({
  value,
  options,
  onSave,
  onCancel,
}: SelectEditRendererProps<TValue>): React.JSX.Element => {
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // Open menu by default

  // Close the menu when user makes a selection (before saving)
  useEffect(() => {
    if (isSaving) {
      setIsOpen(false);
    }
  }, [isSaving]);

  const handleChange = useCallback(
    async (event: SelectChangeEvent<string>) => {
      logger.info("SelectEditRenderer: handleChange called", {
        value: event.target.value,
      });

      if (isSaving) {
        logger.info("SelectEditRenderer: Already saving, ignoring");
        return;
      }

      const newValueString = event.target.value;

      // Normalize old value for comparison
      const normalizedOldValue = (value || "") as string;

      // Only save if the value has actually changed
      if (newValueString === normalizedOldValue) {
        logger.info("SelectEditRenderer: Value unchanged, ignoring");
        return;
      }

      logger.info("SelectEditRenderer: Saving new value", {
        old: normalizedOldValue,
        new: newValueString,
      });
      setIsSaving(true);

      try {
        // Convert string back to TValue and save
        await onSave(newValueString as unknown as TValue);
        logger.info("SelectEditRenderer: Save successful");
        // Don't set isSaving(false) here - component unmounts after successful save
      } catch (err) {
        // Error handling - only reset isSaving on error (component stays mounted)
        logger.error("SelectEditRenderer: Save failed", err);
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

  return (
    <FormControl fullWidth size="small" variant="standard">
      <Select<string>
        value={(value || "") as string}
        open={isOpen}
        onChange={handleChange}
        onClose={handleClose}
        onKeyDown={handleKeyDown}
        disabled={isSaving}
        autoFocus
        disableUnderline
        sx={{
          "& .MuiSelect-select": {
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
      </Select>
    </FormControl>
  );
};

export default SelectEditRenderer;
