import React, { type FC } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { DateDataSourceType } from "@/client/graphql/generated/gql/graphql";

interface DateDataSourceSelectorProps {
  selectedType: DateDataSourceType;
  onTypeChange: (type: DateDataSourceType) => void;
  disabled?: boolean;
  dateVariablesDisabled: boolean;
}

export const DateDataSourceSelector: FC<DateDataSourceSelectorProps> = ({
  selectedType,
  onTypeChange,
  disabled,
  dateVariablesDisabled,
}) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{strings.dateElement.dataSourceLabel}</InputLabel>
      <Select
        value={selectedType}
        label={strings.dateElement.dataSourceLabel}
        onChange={e => onTypeChange(e.target.value)}
      >
        <MenuItem value={DateDataSourceType.Static}>{strings.dateElement.dataSourceStatic}</MenuItem>
        <MenuItem value={DateDataSourceType.StudentDateField}>{strings.dateElement.dataSourceStudentField}</MenuItem>
        <MenuItem value={DateDataSourceType.CertificateDateField}>
          {strings.dateElement.dataSourceCertificateField}
        </MenuItem>
        <MenuItem value={DateDataSourceType.TemplateDateVariable} disabled={dateVariablesDisabled}>
          {strings.dateElement.dataSourceTemplateVariable}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
