import React, { type FC } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import type { StudentTextField } from "./types";

interface StudentFieldSelectorProps {
  value: StudentTextField;
  onChange: (field: StudentTextField) => void;
  error?: string;
  disabled?: boolean;
}

export const StudentFieldSelector: FC<StudentFieldSelectorProps> = ({
  value,
  onChange,
  error,
  disabled,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  return (
    <FormControl fullWidth error={!!error} disabled={disabled}>
      <InputLabel>{strings.textElement.studentFieldLabel}</InputLabel>
      <Select
        value={value}
        label={strings.textElement.studentFieldLabel}
        onChange={(e) => onChange(e.target.value as StudentTextField)}
      >
        <MenuItem value="STUDENT_NAME">
          {strings.textElement.studentFieldName}
        </MenuItem>
        <MenuItem value="STUDENT_EMAIL">
          {strings.textElement.studentFieldEmail}
        </MenuItem>
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

