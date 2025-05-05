"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import useAppTranslation from "@/locale/useAppTranslation";
import AppLanguage from "@/locale/AppLanguage";

// Type definition for the component props
export type LanguageSelectorProps = {
    language: AppLanguage;
    setLanguage: (language: AppLanguage) => void;
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
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    language,
    setLanguage,
    fullWidth,
    required,
    label,
    style,
}: LanguageSelectorProps): React.ReactNode => {
    const strings = useAppTranslation("languageTranslations");

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
            getOptionLabel={(option) => strings[option] || option}
            renderOption={(
                props: React.HTMLAttributes<HTMLLIElement> & { key: any },
                option: AppLanguage,
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
                        <img
                            loading="lazy"
                            width="20"
                            height="15"
                            src={`https://unpkg.com/language-icons/icons/${option}.svg`}
                            alt=""
                            style={{ objectFit: 'contain' }}
                        />
                        {strings[option] || option}
                    </Box>
                );
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label ?? strings.selectLanguage}
                    required={required}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <img
                                        loading="lazy"
                                        width="20"
                                        height="15"
                                        src={`https://unpkg.com/language-icons/icons/${language}.svg`}
                                        alt=""
                                        style={{ objectFit: 'contain' }}
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

export default LanguageSelector;
