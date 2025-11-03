import React, { type FC } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { CertificateDateField } from "@/client/graphql/generated/gql/graphql";

interface CertificateDateFieldSelectorProps {
  value: CertificateDateField;
  onChange: (field: CertificateDateField) => void;
  error?: string;
  disabled?: boolean;
}

export const CertificateDateFieldSelector: FC<
  CertificateDateFieldSelectorProps
> = ({ value, onChange, error, disabled }) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  return (
    <FormControl fullWidth error={!!error} disabled={disabled}>
      <InputLabel>{strings.dateElement.certificateFieldLabel}</InputLabel>
      <Select
        value={value}
        label={strings.dateElement.certificateFieldLabel}
        onChange={e => onChange(e.target.value as CertificateDateField)}
      >
        <MenuItem value={CertificateDateField.ReleaseDate}>
          {strings.dateElement.certificateFieldReleaseDate}
        </MenuItem>
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
