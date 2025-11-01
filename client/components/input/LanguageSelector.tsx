import React from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { AppLanguage } from "@/client/graphql/generated/gql/graphql";
import { useAppTranslation } from "@/client/locale";

interface LocaleSelectorProps {
  value: AppLanguage;
  onChange: (value: AppLanguage) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LocaleSelectorProps> = ({
  value,
  onChange,
  disabled,
}) => {
  const strings = useAppTranslation("languageTranslations");

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value as AppLanguage);
  };

  const languageOptions = React.useMemo(() => {
    return [
      {
        value: AppLanguage.Ar,
        label: strings.ar,
        shortLabel: strings.arShort,
        flag: "🇸🇦",
      },
      {
        value: AppLanguage.En,
        label: strings.en,
        shortLabel: strings.enShort,
        flag: "🇺🇸",
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
            {option.flag} {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
