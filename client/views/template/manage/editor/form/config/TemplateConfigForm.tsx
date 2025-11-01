import React from "react";
import { Grid, TextField } from "@mui/material";
import { LanguageSelector } from "@/client/components";
import {
  TemplateConfigFormErrors,
  TemplateConfigFormState,
  TemplateConfigFormUpdateFn,
} from "./types";
import { useAppTranslation } from "@/client/locale";

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
  const { templateConfigTranslations: strings } = useAppTranslation();
  return (
    <Grid container spacing={4}>
      {/* width field */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label={strings.width}
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

      {/* Height field */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label={strings.height}
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

      {/* Language field */}
      <Grid size={12}>
        <LanguageSelector
          value={state.language}
          onChange={value => updateFn({ key: "language", value })}
          disabled={disabled}
        />
      </Grid>
    </Grid>
  );
};
