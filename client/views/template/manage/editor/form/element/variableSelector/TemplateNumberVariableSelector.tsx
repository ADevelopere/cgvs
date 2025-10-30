import { Autocomplete, TextField } from "@mui/material";
import { TemplateNumberVariable } from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";

export type TemplateNumberVariableSelectorProps = {
  value: number | null;
  onChange: (variableId: number | null) => void;
  numberVariables: TemplateNumberVariable[];
  error?: string;
  disabled?: boolean;
  label?: string;
};

export const TemplateNumberVariableSelector = ({
  value,
  onChange,
  numberVariables,
  error,
  disabled = false,
  label,
}: TemplateNumberVariableSelectorProps) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  const selectedVariable = numberVariables.find((v) => v.id === value) ?? null;

  return (
    <Autocomplete
      value={selectedVariable}
      onChange={(_, newValue) => {
        onChange(newValue?.id ?? null);
      }}
      options={numberVariables}
      getOptionLabel={(option) => option.name ?? ""}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <div>
            <div style={{ fontWeight: 500 }}>{option.name}</div>
            {option.description && (
              <div style={{ fontSize: "0.875rem", color: "text.secondary" }}>
                {option.description}
              </div>
            )}
            <div style={{ fontSize: "0.75rem", color: "text.secondary" }}>
              {option.minValue !== null && option.maxValue !== null && (
                <span>
                  Range: {option.minValue} - {option.maxValue} |{" "}
                </span>
              )}
              {option.decimalPlaces !== null && (
                <span>Decimals: {option.decimalPlaces}</span>
              )}
            </div>
          </div>
        </li>
      )}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || strings.numberElement.variableLabel}
          error={!!error}
          helperText={error}
          required
        />
      )}
    />
  );
};

