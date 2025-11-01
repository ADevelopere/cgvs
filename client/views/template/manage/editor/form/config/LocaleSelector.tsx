import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { CountryCode } from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";
import AppLanguage from "@/client/locale/AppLanguage";

interface LocaleSelectorProps {
  value: CountryCode;
  onChange: (value: CountryCode) => void;
  disabled?: boolean;
}

export const LocaleSelector: React.FC<LocaleSelectorProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const strings = useAppTranslation("languageTranslations");

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value as CountryCode);
  };

  const languageOptions = React.useMemo(() => {
    return [
      {
        value: AppLanguage.default,
        label: strings.ar,
        shortLabel: strings.arShort,
      },
      {
        value: AppLanguage.en,
        label: strings.en,
        shortLabel: strings.enShort,
      },
    ];
  }, [strings]);

  return (
    <FormControl fullWidth>
      <InputLabel>Locale</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        label="Locale"
      >
        {languageOptions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
