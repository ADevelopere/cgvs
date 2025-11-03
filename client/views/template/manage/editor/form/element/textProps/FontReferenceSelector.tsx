import React, { type FC, useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  TextField,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import {
  Font,
  FontReferenceInput,
  FontSource,
} from "@/client/graphql/generated/gql/graphql";
import { UpdateFontRefFn } from "./types";
import {  } from "next/font/google";
import { AppLanguage } from "@/lib/enum";

interface FontReferenceSelectorProps {
  fontRef: FontReferenceInput;
  language: AppLanguage;
  selfHostedFonts: Font[];
  onFontRefChange: UpdateFontRefFn;
  error?: string;
  disabled?: boolean;
}

interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
}


const GOOGLE_FONTS_API_KEY = process.env.GOOGLE_FONTS_API_KEY || "";

export const FontReferenceSelector: FC<FontReferenceSelectorProps> = ({
  fontRef,
  language,
  selfHostedFonts,
  onFontRefChange,
  error,
  disabled,
}) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();
  const [googleFonts, setGoogleFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Google Fonts on mount
  useEffect(() => {
    const fetchGoogleFonts = async () => {
      setLoading(true);
      try {
        // Note: In production, the API key should be from environment variable
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}`
        );
        const data = await response.json();
        setGoogleFonts(data.items || []);
      } catch (_err) {
        // Fallback to common fonts if API fails
        setGoogleFonts([
          { family: "Roboto", variants: [], subsets: [] },
          { family: "Open Sans", variants: [], subsets: [] },
          { family: "Lato", variants: [], subsets: [] },
          { family: "Montserrat", variants: [], subsets: [] },
          { family: "Oswald", variants: [], subsets: [] },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleFonts();
  }, []);

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
          loading={loading}
          disabled={disabled}
          renderInput={params => (
            <TextField
              {...params}
              label={strings.textProps.googleFontLabel}
              placeholder={strings.textProps.googleFontPlaceholder}
              error={!!error}
              helperText={error}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
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
    () =>
      fontRef.google?.identifier ? FontSource.Google : FontSource.SelfHosted,
    [fontRef]
  );

  return (
    <Box>
      <FormControl component="fieldset" error={!!error} disabled={disabled}>
        <RadioGroup
          row
          value={currentSource}
          onChange={e => handleSourceChange(e.target.value as FontSource)}
        >
          <FormControlLabel
            value="GOOGLE"
            control={<Radio />}
            label={strings.textProps.fontSourceGoogle}
          />
          <FormControlLabel
            value="SELF_HOSTED"
            control={<Radio />}
            label={strings.textProps.fontSourceSelfHosted}
          />
        </RadioGroup>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>

      <Box mt={2}>{renderFontInput()}</Box>
    </Box>
  );
};
