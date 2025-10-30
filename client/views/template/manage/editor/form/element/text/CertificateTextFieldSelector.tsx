import React, { type FC } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import type { CertificateTextField } from "./types";

interface CertificateFieldSelectorProps {
  value: CertificateTextField;
  onChange: (field: CertificateTextField) => void;
  error?: string;
  disabled?: boolean;
}

export const CertificateFieldSelector: FC<CertificateFieldSelectorProps> = ({
  value,
  onChange,
  error,
  disabled,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  return (
    <FormControl fullWidth error={!!error} disabled={disabled}>
      <InputLabel>{strings.textElement.certificateFieldLabel}</InputLabel>
      <Select
        value={value}
        label={strings.textElement.certificateFieldLabel}
        onChange={(e) => onChange(e.target.value as CertificateTextField)}
      >
        <MenuItem value="VERIFICATION_CODE">
          {strings.textElement.certificateFieldVerificationCode}
        </MenuItem>
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

