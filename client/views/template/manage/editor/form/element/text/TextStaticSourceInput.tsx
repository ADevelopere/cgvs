import React, { type FC } from "react";
import { TextField } from "@mui/material";
import { useAppTranslation } from "@/client/locale";

interface StaticSourceInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const TextStaticSourceInput: FC<StaticSourceInputProps> = ({
  value,
  onChange,
  error,
  disabled,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  return (
    <TextField
      fullWidth
      label={strings.textElement.staticValueLabel}
      placeholder={strings.textElement.staticValuePlaceholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      disabled={disabled}
    />
  );
};

