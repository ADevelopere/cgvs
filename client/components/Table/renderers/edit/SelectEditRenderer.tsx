import React, { useState, useCallback } from "react";
import {
  TextField,
  Autocomplete,
} from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { Clear as ClearIcon } from "@mui/icons-material";
import { useTableLocale } from "../../contexts/TableLocaleContext";

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
  /**
   * Callback to notify parent of error state changes
   */
  onErrorChange?: (error: string | null) => void;
}

/**
 * SelectEditRenderer Component
 *
 * Select dropdown that opens automatically and saves immediately on selection.
 * Uses Autocomplete for better popup positioning and width control.
 */
export const SelectEditRenderer = <
  TValue extends string | number | null | undefined =
    | string
    | number
    | null
    | undefined,
>({
  value,
  options,
  onSave,
  onCancel,
}: SelectEditRendererProps<TValue>): React.JSX.Element => {
  const [open, setOpen] = useState(true);
  const { strings: { general} } = useTableLocale();

  const currentOption = options.find(opt => opt.value === value) || null;

  const handleChange = useCallback(
    (
      _event: React.SyntheticEvent,
      newValue: { label: string; value: TValue | null | undefined } | null
    ) => {
      const newVal = newValue?.value;

      // Only save if the value has actually changed
      if (newVal === value) {
        onCancel();
        return;
      }

      // Exit edit mode immediately
      onCancel();
      // Save in the background (fire and forget)
      onSave(newVal ?? null).catch(() => {
        // Error handling is done by the parent component
      });
    },
    [onSave, value, onCancel]
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
    setOpen(false);
    onCancel();
  }, [onCancel]);

  const handleClickAway = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleClear = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();

      // Exit edit mode immediately
      onCancel();
      // Save in the background (fire and forget)
      onSave(null).catch(() => {
        // Error handling is done by the parent component
      });
    },
    [onSave, onCancel]
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div>
        <Autocomplete
          open={open}
          onClose={handleClose}
          value={currentOption}
          onChange={handleChange}
          options={options}
          getOptionLabel={option => option.label}
          isOptionEqualToValue={(option, val) => option.value === val.value}
          openOnFocus
          autoHighlight
          disablePortal={false}
          slotProps={{
            popper: {
              placement: "bottom-start",
              modifiers: [
                {
                  name: "flip",
                  enabled: true,
                },
              ],
              sx: {
                minWidth: "200px", // Minimum width for the dropdown
              },
            },
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant="standard"
              autoFocus
              onKeyDown={handleKeyDown}
              slotProps={{
                input: {
                  ...params.InputProps,
                  disableUnderline: true,
                },
              }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: 0,
                },
              }}
            />
          )}
          clearIcon={
            <>
              {value && (
                <ClearIcon fontSize="small" onClick={handleClear} />
              )}
            </>
          }
            clearText={general.delete}
            closeText={general.cancel}
          />
      </div>
    </ClickAwayListener>
  );
};

export default SelectEditRenderer;
