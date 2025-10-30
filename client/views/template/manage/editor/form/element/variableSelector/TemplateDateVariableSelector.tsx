import React, { type FC } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { TemplateDateVariable } from "@/client/graphql/generated/gql/graphql";

interface TemplateDateVariableSelectorProps {
  value: number | undefined;
  variables: TemplateDateVariable[];
  onChange: (variableId: number) => void;
  error?: string;
  disabled?: boolean;
}

export const TemplateDateVariableSelector: FC<
  TemplateDateVariableSelectorProps
> = ({ value, variables, onChange, error, disabled }) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  const selectedVariable = variables.find(v => v.id === value) || null;

  return (
    <Autocomplete
      value={selectedVariable}
      options={variables}
      getOptionLabel={option => option.name || ""}
      onChange={(_event, newValue) => {
        if (newValue?.id) {
          onChange(newValue.id);
        }
      }}
      disabled={disabled}
      noOptionsText={strings.dateElement.noVariablesAvailable}
      renderInput={params => (
        <TextField
          {...params}
          label={strings.dateElement.templateDateVariableLabel}
          placeholder={strings.dateElement.selectVariable}
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
};
