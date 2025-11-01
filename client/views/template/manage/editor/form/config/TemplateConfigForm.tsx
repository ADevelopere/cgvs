import React from "react";
import { Stack, TextField } from "@mui/material";
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
    <Stack spacing={2} direction="column">
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
      <LanguageSelector
        value={state.language}
        onChange={value => updateFn({ key: "language", value })}
        disabled={disabled}
      />
    </Stack>
  );
};
