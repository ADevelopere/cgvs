import React, { useCallback, useState } from "react";
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
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isSaving) return;

      const newValue = event.target.checked;
      setIsSaving(true);

      try {
        await onSave(newValue);
      } catch (_err) {
        // Error handling - could show toast
        setIsSaving(false);
      }
    },
    [onSave, isSaving]
  );

  return (
    <Checkbox
      checked={!!value}
      onChange={handleChange}
      disabled={isSaving}
      size="small"
      sx={{
        padding: 0,
      }}
    />
  );
};

export default BooleanEditRenderer;
