import React, { type FC } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useAppTranslation } from "@/client/locale";
import { enUS, arEG } from "date-fns/locale";
import { useAppTheme } from "@/client/contexts/ThemeContext";

interface DateStaticSourceInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const DateStaticSourceInput: FC<DateStaticSourceInputProps> = ({ value, onChange, error, disabled }) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();
  const { language } = useAppTheme();

  const locale = language === "ar" ? arEG : enUS;

  // Convert string to Date or null
  const dateValue = value ? new Date(value) : null;

  const handleChange = (newDate: Date | null) => {
    if (newDate && !isNaN(newDate.getTime())) {
      // Convert to ISO string (YYYY-MM-DD format)
      const isoString = newDate.toISOString().split("T")[0];
      onChange(isoString);
    } else {
      onChange("");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale}>
      <DatePicker
        label={strings.dateElement.staticValueLabel}
        value={dateValue}
        onChange={handleChange}
        disabled={disabled}
        slotProps={{
          textField: {
            fullWidth: true,
            error: !!error,
            helperText: error,
          },
        }}
      />
    </LocalizationProvider>
  );
};
