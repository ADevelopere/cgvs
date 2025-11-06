import React, { type FC } from "react";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { StudentDateField } from "@/client/graphql/generated/gql/graphql";

interface StudentDateFieldSelectorProps {
  value: StudentDateField;
  onChange: (field: StudentDateField) => void;
  error?: string;
  disabled?: boolean;
}

export const StudentDateFieldSelector: FC<StudentDateFieldSelectorProps> = ({ value, onChange, error, disabled }) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  return (
    <FormControl fullWidth error={!!error} disabled={disabled}>
      <InputLabel>{strings.dateElement.studentFieldLabel}</InputLabel>
      <Select
        value={value}
        label={strings.dateElement.studentFieldLabel}
        onChange={e => onChange(e.target.value as StudentDateField)}
      >
        <MenuItem value="DATE_OF_BIRTH">{strings.dateElement.studentFieldDateOfBirth}</MenuItem>
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
