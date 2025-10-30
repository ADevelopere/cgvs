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
import type { FontReferenceState, FontSource, Font } from "./text/types";

interface FontReferenceSelectorProps {
  fontRef: FontReferenceState;
  locale: string;
  selfHostedFonts: Font[];
  onFontRefChange: (fontRef: FontReferenceState) => void;
  error?: string;
  disabled?: boolean;
}

interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
}

export const FontReferenceSelector: FC<FontReferenceSelectorProps> = ({
  fontRef,
  locale: _locale,
  selfHostedFonts,
  onFontRefChange,
  error,
  disabled,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");
  const [googleFonts, setGoogleFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch Google Fonts on mount
  useEffect(() => {
    const fetchGoogleFonts = async () => {
      setLoading(true);
      try {
        // Note: In production, the API key should be from environment variable
        const response = await fetch(
          "https://www.googleapis.com/webfonts/v1/webfonts?key=YOUR_API_KEY"
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
      onFontRefChange({ type: "GOOGLE", identifier: "Roboto" });
    } else {
      onFontRefChange({
        type: "SELF_HOSTED",
        fontId: selfHostedFonts[0]?.id || 0,
      });
    }
  };

  const renderFontInput = () => {
    switch (fontRef.type) {
      case "GOOGLE":
        return (
          <Autocomplete
            value={
              googleFonts.find((f) => f.family === fontRef.identifier) || null
            }
            options={googleFonts}
            getOptionLabel={(option) => option.family}
            onChange={(_event, newValue) => {
              if (newValue) {
                onFontRefChange({ type: "GOOGLE", identifier: newValue.family });
              }
            }}
            loading={loading}
            disabled={disabled}
            renderInput={(params) => (
              <TextField
                {...params}
                label={strings.textProps.googleFontLabel}
                placeholder={strings.textProps.googleFontPlaceholder}
                error={!!error}
                helperText={error}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        );

      case "SELF_HOSTED":
        const selectedFont =
          selfHostedFonts.find((f) => f.id === fontRef.fontId) || null;

        return (
          <Autocomplete
            value={selectedFont}
            options={selfHostedFonts}
            getOptionLabel={(option) => option.name || ""}
            onChange={(_event, newValue) => {
              if (newValue?.id) {
                onFontRefChange({ type: "SELF_HOSTED", fontId: newValue.id });
              }
            }}
            disabled={disabled}
            noOptionsText={strings.textProps.noFontsFound}
            renderInput={(params) => (
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
  };

  return (
    <Box>
      <FormControl component="fieldset" error={!!error} disabled={disabled}>
        <RadioGroup
          row
          value={fontRef.type}
          onChange={(e) => handleSourceChange(e.target.value as FontSource)}
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

