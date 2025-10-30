import React, { type FC } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import type { TextDataSourceType } from "./types";

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
  const strings = useAppTranslation("certificateElementsTranslations");

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel>{strings.textElement.dataSourceLabel}</InputLabel>
      <Select
        value={selectedType}
        label={strings.textElement.dataSourceLabel}
        onChange={(e) => onTypeChange(e.target.value as TextDataSourceType)}
      >
        <MenuItem value="STATIC">
          {strings.textElement.dataSourceStatic}
        </MenuItem>
        <MenuItem value="STUDENT_TEXT_FIELD">
          {strings.textElement.dataSourceStudentField}
        </MenuItem>
        <MenuItem value="CERTIFICATE_TEXT_FIELD">
          {strings.textElement.dataSourceCertificateField}
        </MenuItem>
        <MenuItem value="TEMPLATE_TEXT_VARIABLE">
          {strings.textElement.dataSourceTemplateTextVariable}
        </MenuItem>
        <MenuItem value="TEMPLATE_SELECT_VARIABLE">
          {strings.textElement.dataSourceTemplateSelectVariable}
        </MenuItem>
      </Select>
    </FormControl>
  );
};

