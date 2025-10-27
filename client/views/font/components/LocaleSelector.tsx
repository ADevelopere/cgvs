import React from "react";
import * as MUI from "@mui/material";
import { LOCALE_OPTIONS } from "../types";
import { useAppTranslation } from "@/client/locale";

interface LocaleSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export const LocaleSelector: React.FC<LocaleSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const strings = useAppTranslation("fontManagementTranslations");
  
  const selectedOptions = LOCALE_OPTIONS.filter(opt =>
    value.includes(opt.value)
  );

  const isAllSelected = value.includes("all");

  return (
    <MUI.Autocomplete
      multiple
      limitTags={2}
      options={LOCALE_OPTIONS}
      value={selectedOptions}
      onChange={(_, newValue) => {
        const lastSelected = newValue[newValue.length - 1];
        if (lastSelected?.value === "all") {
          // When "all" is selected, only keep "all"
          onChange(["all"]);
        } else {
          // Remove "all" if present and use selected locales
          const values = newValue
            .filter(opt => opt.value !== "all")
            .map(opt => opt.value);
          onChange(values);
        }
      }}
      getOptionLabel={option => `${option.flag} ${option.label}`}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      disabled={disabled}
      disableCloseOnSelect
      renderInput={params => (
        <MUI.TextField
          {...params}
          placeholder={strings.selectLocalesPlaceholder}
          size="small"
        />
      )}
      renderOption={(props, option, { selected }) => {
        const isDisabled = isAllSelected && option.value !== "all";
        return (
          <li {...props} key={option.value}>
            <MUI.Checkbox
              checked={selected}
              disabled={isDisabled}
              size="small"
              sx={{ mr: 1 }}
            />
            <MUI.Typography variant="body2">
              <span style={{ marginInlineEnd: 8 }}>{option.flag}</span>
              {option.label}
            </MUI.Typography>
          </li>
        );
      }}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <MUI.Chip
            {...getTagProps({ index })}
            key={option.value}
            label={`${option.flag} ${option.label}`}
            size="small"
          />
        ))
      }
    />
  );
};
