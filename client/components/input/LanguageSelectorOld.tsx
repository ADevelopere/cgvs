"use client";

import * as React from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { useAppTranslation } from "@/client/locale";
import { AppLanguage } from "@/lib/enum";

// Type definition for the component props
export type LanguageSelectorProps = {
  language: AppLanguage;
  setLanguageAction: (language: AppLanguage) => void;
  fullWidth?: boolean;
  required?: boolean;
  label?: string;
  style?: React.CSSProperties;
};

/**
 * LanguageSelector component allows users to select a language from a dropdown list.
 * @param {LanguageSelectorProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered LanguageSelector component.
 */
export const LanguageSelectorOld: React.FC<LanguageSelectorProps> = ({
  language,
  setLanguageAction: setLanguage,
  fullWidth,
  required,
  label,
  style,
}: LanguageSelectorProps): React.ReactNode => {
  const { languageTranslations: strings } = useAppTranslation();

  return (
    <Autocomplete
      fullWidth={fullWidth}
      options={Object.values(AppLanguage)}
      autoHighlight
      value={language}
      onChange={(_, newValue) => {
        if (newValue) {
          setLanguage(newValue);
        }
      }}
      style={style}
      getOptionLabel={option => strings[option] || option}
      renderOption={(
        props: React.HTMLAttributes<HTMLLIElement> & {
          key: string | number;
        },
        option: AppLanguage
      ) => {
        // key is extracted from props to prevent it from being passed to the DOM
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { key, ...optionProps } = props;
        return (
          <Box
            key={option}
            component="li"
            {...optionProps}
            sx={{
              "& > img": {
                flexShrink: 0,
                mr: 2,
              },
            }}
          >
            <Image
              width={20}
              height={15}
              src={`https://unpkg.com/language-icons/icons/${option}.svg`}
              alt={option}
              style={{ objectFit: "contain" }}
              unoptimized
            />
            {strings[option] || option}
          </Box>
        );
      }}
      renderInput={params => (
        <TextField
          {...params}
          label={label ?? strings.selectLanguage}
          required={required}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Image
                    width={20}
                    height={15}
                    src={`https://unpkg.com/language-icons/icons/${language}.svg`}
                    alt={language}
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
};
