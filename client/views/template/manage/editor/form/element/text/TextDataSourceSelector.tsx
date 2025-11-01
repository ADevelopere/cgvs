import React, { type FC } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { TextDataSourceType } from "@/client/graphql/generated/gql/graphql";

interface DataSourceSelectorProps {
  selectedType: TextDataSourceType;
  onTypeChange: (type: TextDataSourceType) => void;
  disabled?: boolean;
}

export const DataSourceSelector: FC<DataSourceSelectorProps> = ({
  selectedType,
  onTypeChange,
  disabled,
}) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{strings.textElement.dataSourceLabel}</InputLabel>
      <Select
        value={selectedType}
        label={strings.textElement.dataSourceLabel}
        onChange={e => onTypeChange(e.target.value)}
      >
        <MenuItem value={TextDataSourceType.Static}>
          {strings.textElement.dataSourceStatic}
        </MenuItem>
        <MenuItem value={TextDataSourceType.StudentTextField}>
          {strings.textElement.dataSourceStudentField}
        </MenuItem>
        <MenuItem value={TextDataSourceType.CertificateTextField}>
          {strings.textElement.dataSourceCertificateField}
        </MenuItem>
        <MenuItem value={TextDataSourceType.TemplateTextVariable}>
          {strings.textElement.dataSourceTemplateTextVariable}
        </MenuItem>
        <MenuItem value={TextDataSourceType.TemplateSelectVariable}>
          {strings.textElement.dataSourceTemplateSelectVariable}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
