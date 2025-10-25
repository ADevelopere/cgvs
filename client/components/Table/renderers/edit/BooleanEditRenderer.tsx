import React, { useCallback } from "react";
import { Checkbox } from "@mui/material";

export interface BooleanEditRendererProps {
  value: boolean | null | undefined;
  onSave: (value: boolean) => Promise<void>;
  onCancel: () => void;
}

/**
 * BooleanEditRenderer Component
 *
 * Checkbox that immediately saves on toggle.
 */
export const BooleanEditRenderer: React.FC<BooleanEditRendererProps> = ({
  value,
  onSave,
  onCancel,
}) => {
  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.checked;

      // Early return if value hasn't changed
      if (newValue === !!value) {
        onCancel();
        return;
      }

      // Exit edit mode immediately
      onCancel();

      // Save in the background (fire and forget)
      onSave(newValue).catch(() => {
        // Error handling is done by the parent component
      });
    },
    [onSave, value, onCancel]
  );

  return (
    <Checkbox
      checked={!!value}
      onChange={handleChange}
      size="small"
      sx={{
        padding: 0,
      }}
    />
  );
};

export default BooleanEditRenderer;
