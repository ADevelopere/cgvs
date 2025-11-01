import React from "react";
import { Grid, TextField } from "@mui/material";
import { LanguageSelector } from "@/client/components";
import {
  TemplateConfigFormErrors,
  TemplateConfigFormState,
  TemplateConfigFormUpdateFn,
} from "./types";

interface TemplateConfigFormProps {
  state: TemplateConfigFormState;
  updateFn: TemplateConfigFormUpdateFn;
  errors: TemplateConfigFormErrors;
  disabled: boolean;
}

export const TemplateConfigForm: React.FC<TemplateConfigFormProps> = ({
  state,
  updateFn,
  errors,
  disabled,
}) => {
  return (
    // Use Grid v2 container. It will take the width of its parent (the Box)
    <Grid container spacing={4}>
      {/* Width field: Full-width on xs, half-width on sm and up */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Width"
          type="number"
          value={state.width}
          onChange={e =>
            updateFn({ key: "width", value: parseInt(e.target.value, 10) })
          }
          fullWidth
          error={!!errors.width}
          helperText={errors.width}
          disabled={disabled}
        />
      </Grid>

      {/* Height field: Full-width on xs, half-width on sm and up */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Height"
          type="number"
          value={state.height}
          onChange={e =>
            updateFn({ key: "height", value: parseInt(e.target.value, 10) })
          }
          fullWidth
          error={!!errors.height}
          helperText={errors.height}
          disabled={disabled}
        />
      </Grid>

      {/* LanguageSelector: Full-width on all screen sizes */}
      <Grid size={12}>
        <LanguageSelector
          value={state.language}
          onChange={value => updateFn({ key: "language", value })}
          disabled={disabled}
          // If your LanguageSelector doesn't expand,
          // you may need to wrap it in a <FormControl fullWidth>
        />
      </Grid>
    </Grid>
  );
};
