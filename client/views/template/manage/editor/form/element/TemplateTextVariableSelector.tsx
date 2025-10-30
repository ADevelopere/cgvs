import React, { type FC } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import type { TemplateTextVariable } from "./text/types";

interface TemplateTextVariableSelectorProps {
  value: number | undefined;
  variables: TemplateTextVariable[];
  onChange: (variableId: number) => void;
  error?: string;
  disabled?: boolean;
}

export const TemplateTextVariableSelector: FC<
  TemplateTextVariableSelectorProps
> = ({ value, variables, onChange, error, disabled }) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  const selectedVariable =
    variables.find((v) => v.id === value) || null;

  return (
    <Autocomplete
      value={selectedVariable}
      options={variables}
      getOptionLabel={(option) => option.name || ""}
      onChange={(_event, newValue) => {
        if (newValue?.id) {
          onChange(newValue.id);
        }
      }}
      disabled={disabled}
      noOptionsText={strings.textElement.noVariablesAvailable}
      renderInput={(params) => (
        <TextField
          {...params}
          label={strings.textElement.templateTextVariableLabel}
          placeholder={strings.textElement.selectVariable}
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};

