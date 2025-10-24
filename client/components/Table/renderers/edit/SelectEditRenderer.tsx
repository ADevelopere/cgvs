import React, { useState, useCallback } from "react";
import { Select, MenuItem, FormControl, SelectChangeEvent } from "@mui/material";

export interface SelectEditRendererProps<TValue> {
  value: TValue;
  options: Array<{ label: string; value: TValue }>;
  onSave: (value: TValue) => Promise<void>;
  onCancel: () => void;
}

/**
 * SelectEditRenderer Component
 *
 * Select dropdown that saves immediately on selection.
 */
export const SelectEditRenderer = <TValue,>({
  value,
  options,
  onSave,
  onCancel,
}: SelectEditRendererProps<TValue>): React.JSX.Element => {
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(async (event: SelectChangeEvent<TValue>) => {
      if (isSaving) return;

      const newValue = event.target.value as TValue;
      setIsSaving(true);

      try {
        await onSave(newValue);
      } catch (_err) {
        // Error handling
        setIsSaving(false);
      }
    },
    [onSave, isSaving]
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

  return (
    <FormControl fullWidth size="small" variant="standard">
      <Select
        value={value || ""}
        onChange={handleChange}
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
          <MenuItem key={option.value as unknown as string} value={option.value as unknown as string}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectEditRenderer;
