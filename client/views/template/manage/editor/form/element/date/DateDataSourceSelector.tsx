import React, { type FC } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { DateDataSourceType } from "@/client/graphql/generated/gql/graphql";

interface DateDataSourceSelectorProps {
  selectedType: DateDataSourceType;
  onTypeChange: (type: DateDataSourceType) => void;
  disabled?: boolean;
}

export const DateDataSourceSelector: FC<DateDataSourceSelectorProps> = ({
  selectedType,
  onTypeChange,
  disabled,
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
        <MenuItem value="STATIC">
          {strings.dateElement.dataSourceStatic}
        </MenuItem>
        <MenuItem value="STUDENT_DATE_FIELD">
          {strings.dateElement.dataSourceStudentField}
        </MenuItem>
        <MenuItem value="CERTIFICATE_DATE_FIELD">
          {strings.dateElement.dataSourceCertificateField}
        </MenuItem>
        <MenuItem value="TEMPLATE_DATE_VARIABLE">
          {strings.dateElement.dataSourceTemplateVariable}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
