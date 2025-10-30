import React, { type FC } from "react";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Typography,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { FontReferenceSelector } from "./FontReferenceSelector";
import { ElementOverflow, Font } from "@/client/graphql/generated/gql/graphql";
import {
  TextPropsFormErrors,
  UpdateTextPropsFn,
  TextPropsState,
} from "./types";

interface TextPropsFormProps {
  textProps: TextPropsState;
  locale: string;
  selfHostedFonts: Font[];
  onTextPropsChange: UpdateTextPropsFn;
  errors: TextPropsFormErrors;
  disabled?: boolean;
}

export const TextPropsForm: FC<TextPropsFormProps> = ({
  textProps,
  locale,
  selfHostedFonts,
  onTextPropsChange,
  errors,
  disabled,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {strings.textProps.textPropertiesTitle}
      </Typography>

      <Grid container spacing={2}>
        {/* Font Reference */}
        <Grid size={{ xs: 12 }}>
          <FontReferenceSelector
            fontRef={textProps.fontRef}
            locale={locale}
            selfHostedFonts={selfHostedFonts}
            onFontRefChange={fontRef => onTextPropsChange("fontRef", fontRef)}
            error={errors.fontRef}
            disabled={disabled}
          />
        </Grid>

        {/* Color */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="color"
            label={strings.textProps.colorLabel}
            value={textProps.color}
            onChange={e => onTextPropsChange("color", e.target.value)}
            error={!!errors.color}
            helperText={errors.color}
            disabled={disabled}
          />
        </Grid>

        {/* Font Size */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label={strings.textProps.fontSizeLabel}
            placeholder={strings.textProps.fontSizePlaceholder}
            value={textProps.fontSize}
            onChange={e =>
              onTextPropsChange("fontSize", parseInt(e.target.value, 10) || 0)
            }
            error={!!errors.fontSize}
            helperText={errors.fontSize}
            disabled={disabled}
            slotProps={{ htmlInput: { min: 1, max: 1000 } }}
          />
        </Grid>

        {/* Overflow */}
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth error={!!errors.overflow} disabled={disabled}>
            <InputLabel>{strings.textProps.overflowLabel}</InputLabel>
            <Select
              value={textProps.overflow}
              label={strings.textProps.overflowLabel}
              onChange={e =>
                onTextPropsChange("overflow", e.target.value as ElementOverflow)
              }
            >
              <MenuItem value="RESIZE_DOWN">
                {strings.textProps.overflowResizeDown}
              </MenuItem>
              <MenuItem value="TRUNCATE">
                {strings.textProps.overflowTruncate}
              </MenuItem>
              <MenuItem value="ELLIPSE">
                {strings.textProps.overflowEllipse}
              </MenuItem>
              <MenuItem value="WRAP">{strings.textProps.overflowWrap}</MenuItem>
            </Select>
            {errors.overflow && (
              <FormHelperText>{errors.overflow}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
