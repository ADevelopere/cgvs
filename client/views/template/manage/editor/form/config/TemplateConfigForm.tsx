import React from "react";
import { Stack, TextField } from "@mui/material";
import { LanguageSelector } from "@/client/components";
import { TemplateConfigFormErrors, TemplateConfigFormUpdateFn, TemplateConfigFormState } from "./types";
import { useAppTranslation } from "@/client/locale";

interface TemplateConfigFormProps {
  state: TemplateConfigFormState;
  updateFn: TemplateConfigFormUpdateFn;
  errors: TemplateConfigFormErrors;
  disabled: boolean;
}

export const TemplateConfigForm: React.FC<TemplateConfigFormProps> = ({ state, updateFn, errors, disabled }) => {
  const { templateConfigTranslations: strings } = useAppTranslation();
  return (
    <Stack direction={"column"} spacing={4} sx={{ paddingY: 2 }}>
      {/* width field */}
      <Stack
        useFlexGap
        direction={"row"}
        sx={{
          paddingTop: 1,
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "space-between",
          direction: "row",
          overflow: "clip",
        }}
      >
        <TextField
          label={strings.width}
          type="number"
          value={state.width ?? ""}
          onChange={e => updateFn({ key: "width", value: Number.parseInt(e.target.value, 10) })}
          error={!!errors.width}
          color={errors.width ? "error" : "primary"}
          helperText={errors.width}
          disabled={disabled}
          sx={{ minWidth: 100, flexGrow: 1 }}
        />

        <TextField
          label={strings.height}
          type="number"
          value={state.height ?? ""}
          onChange={e => updateFn({ key: "height", value: Number.parseInt(e.target.value, 10) })}
          error={!!errors.height}
          helperText={errors.height}
          disabled={disabled}
          sx={{ minWidth: 100, flexGrow: 1 }}
        />
      </Stack>

      {/* Language field */}
      <LanguageSelector
        value={state.language}
        onChange={value => updateFn({ key: "language", value })}
        disabled={disabled}
        style={{ minWidth: 100 }}
      />
    </Stack>
  );
};
