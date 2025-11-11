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
import {
  AppLanguage,
  FontFamily,
  FontReferenceInput,
  FontSource,
  FontFamilyName,
} from "@/client/graphql/generated/gql/graphql";
import { UpdateFontRefFn } from "./types";
import { getLanguageFonts } from "@/lib/font/google/utils";
import { Language } from "@/lib/font/google/enum";

interface FontReferenceSelectorProps {
  fontRef: FontReferenceInput;
  language: AppLanguage;
  fontFamilies: FontFamily[];
  onFontRefChange: UpdateFontRefFn;
  error?: string;
  disabled?: boolean;
}

export const FontReferenceSelector: FC<FontReferenceSelectorProps> = ({
  fontRef,
  language,
  fontFamilies,
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
      onFontRefChange({ google: { family: FontFamilyName.Roboto, variant: "400" } });
    } else {
      const firstVariant = fontFamilies[0]?.variants[0];
      if (firstVariant) {
        onFontRefChange({ selfHosted: { fontVariantId: firstVariant.id } });
      }
    }
  };

  const renderFontInput = () => {
    if (fontRef.google?.family) {
      const family = fontRef.google.family;
      const variant = fontRef.google.variant || "400";

      return (
        <Box>
          <Autocomplete
            value={googleFonts.find(f => f.family === family) || null}
            options={googleFonts}
            getOptionLabel={option => option.family}
            onChange={(_event, newValue) => {
              if (newValue) {
                onFontRefChange({
                  google: { family: newValue.family as FontFamilyName, variant },
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
                sx={{ mb: 2 }}
              />
            )}
          />
          <TextField
            label={strings.textProps.fontVariantLabel || "Variant"}
            value={variant}
            onChange={e => {
              onFontRefChange({
                google: { family, variant: e.target.value },
              });
            }}
            disabled={disabled}
            fullWidth
            placeholder="400, 700, italic, etc."
          />
        </Box>
      );
    } else if (fontRef.selfHosted?.fontVariantId) {
      const fontVariantId = fontRef.selfHosted.fontVariantId;

      // Find the selected variant and its family
      let selectedFamily: FontFamily | null = null;
      let selectedVariant: any = null;

      for (const family of fontFamilies) {
        const variant = family.variants.find(v => v.id === fontVariantId);
        if (variant) {
          selectedFamily = family;
          selectedVariant = variant;
          break;
        }
      }

      return (
        <Box>
          <Autocomplete
            value={selectedFamily}
            options={fontFamilies}
            getOptionLabel={option => option.name || ""}
            onChange={(_event, newFamily) => {
              if (newFamily?.variants[0]) {
                onFontRefChange({ selfHosted: { fontVariantId: newFamily.variants[0].id } });
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
                sx={{ mb: 2 }}
              />
            )}
          />
          {selectedFamily && (
            <Autocomplete
              value={selectedVariant}
              options={selectedFamily.variants}
              getOptionLabel={option => option.variant || ""}
              onChange={(_event, newVariant) => {
                if (newVariant?.id) {
                  onFontRefChange({ selfHosted: { fontVariantId: newVariant.id } });
                }
              }}
              disabled={disabled}
              renderInput={params => (
                <TextField
                  {...params}
                  label={strings.textProps.fontVariantLabel || "Variant"}
                  placeholder="Select variant"
                />
              )}
            />
          )}
        </Box>
      );
    }
    return null;
  };

  // Determine current font source from FontReferenceInput
  const currentSource: FontSource = React.useMemo(
    () => (fontRef.google?.family ? FontSource.Google : FontSource.SelfHosted),
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
