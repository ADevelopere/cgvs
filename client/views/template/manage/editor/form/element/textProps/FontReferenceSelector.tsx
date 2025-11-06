import React, { type FC, useMemo } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { AppLanguage, Font, FontReferenceInput, FontSource } from "@/client/graphql/generated/gql/graphql";
import { UpdateFontRefFn } from "./types";
import { getLanguageFonts } from "@/lib/font/google/utils";
import { Language } from "@/lib/font/google/enum";

interface FontReferenceSelectorProps {
  fontRef: FontReferenceInput;
  language: AppLanguage;
  selfHostedFonts: Font[];
  onFontRefChange: UpdateFontRefFn;
  error?: string;
  disabled?: boolean;
}

export const FontReferenceSelector: FC<FontReferenceSelectorProps> = ({
  fontRef,
  language,
  selfHostedFonts,
  onFontRefChange,
  error,
  disabled,
}) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  const googleFonts = useMemo(() => {
    return getLanguageFonts(language as string as Language);
  }, [language]);

  const handleSourceChange = (newSource: FontSource) => {
    if (newSource === "GOOGLE") {
      onFontRefChange({ google: { identifier: "Roboto" } });
    } else {
      const firstFontId = selfHostedFonts[0]?.id;
      if (firstFontId) {
        onFontRefChange({ selfHosted: { fontId: firstFontId } });
      }
    }
  };

  const renderFontInput = () => {
    if (fontRef.google?.identifier) {
      const identifier = fontRef.google.identifier;
      return (
        <Autocomplete
          value={googleFonts.find(f => f.family === identifier) || null}
          options={googleFonts}
          getOptionLabel={option => option.family}
          onChange={(_event, newValue) => {
            if (newValue) {
              onFontRefChange({
                google: { identifier: newValue.family },
              });
            }
          }}
          disabled={disabled}
          renderInput={params => (
            <TextField
              {...params}
              label={strings.textProps.googleFontLabel}
              placeholder={strings.textProps.googleFontPlaceholder}
              error={!!error}
              helperText={error}
            />
          )}
        />
      );
    } else if (fontRef.selfHosted?.fontId) {
      const fontId = fontRef.selfHosted.fontId;
      const selectedFont = selfHostedFonts.find(f => f.id === fontId) || null;

      return (
        <Autocomplete
          value={selectedFont}
          options={selfHostedFonts}
          getOptionLabel={option => option.name || ""}
          onChange={(_event, newValue) => {
            if (newValue?.id) {
              onFontRefChange({ selfHosted: { fontId: newValue.id } });
            }
          }}
          disabled={disabled}
          noOptionsText={strings.textProps.noFontsFound}
          renderInput={params => (
            <TextField
              {...params}
              label={strings.textProps.selfHostedFontLabel}
              placeholder={strings.textProps.selfHostedFontPlaceholder}
              error={!!error}
              helperText={error}
            />
          )}
        />
      );
    }
    return null;
  };

  // Determine current font source from FontReferenceInput
  const currentSource: FontSource = React.useMemo(
    () => (fontRef.google?.identifier ? FontSource.Google : FontSource.SelfHosted),
    [fontRef]
  );

  return (
    <Box>
      <FormControl component="fieldset" error={!!error} disabled={disabled}>
        <RadioGroup row value={currentSource} onChange={e => handleSourceChange(e.target.value as FontSource)}>
          <FormControlLabel value="GOOGLE" control={<Radio />} label={strings.textProps.fontSourceGoogle} />
          <FormControlLabel value="SELF_HOSTED" control={<Radio />} label={strings.textProps.fontSourceSelfHosted} />
        </RadioGroup>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>

      <Box mt={2}>{renderFontInput()}</Box>
    </Box>
  );
};
