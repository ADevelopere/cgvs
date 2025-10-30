import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useAppTranslation } from "@/client/locale";
import { MappingFormErrors } from "./types";

export type NumberMappingInputProps = {
  value: Record<string, string>;
  onChange: (mapping: Record<string, string>) => void;
  errors?: MappingFormErrors;
  disabled?: boolean;
};

export const NumberMappingInput = ({
  value,
  onChange,
  errors = {},
  disabled = false,
}: NumberMappingInputProps) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  const entries = Object.entries(value);

  const handleAddEntry = () => {
    const newMapping = { ...value, "": "2" };
    onChange(newMapping);
  };

  const handleRemoveEntry = (localeToRemove: string) => {
    const newMapping = { ...value };
    delete newMapping[localeToRemove];
    onChange(newMapping);
  };

  const handleLocaleChange = (oldLocale: string, newLocale: string) => {
    const newMapping = { ...value };
    const localeValue = newMapping[oldLocale];
    delete newMapping[oldLocale];
    newMapping[newLocale] = localeValue;
    onChange(newMapping);
  };

  const handleDecimalPlacesChange = (locale: string, decimalPlaces: string) => {
    const newMapping = { ...value, [locale]: decimalPlaces };
    onChange(newMapping);
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {strings.numberElement.mappingLabel}
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
        {strings.numberElement.mappingDescription}
      </Typography>

      {entries.map(([locale, decimalPlaces], index) => (
        <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth
              label={strings.numberElement.localeLabel}
              value={locale}
              onChange={(e) => handleLocaleChange(locale, e.target.value)}
              disabled={disabled}
              size="small"
              placeholder="ar, en, fr..."
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              fullWidth
              label={strings.numberElement.decimalPlacesLabel}
              value={decimalPlaces}
              onChange={(e) => handleDecimalPlacesChange(locale, e.target.value)}
              disabled={disabled}
              size="small"
              type="number"
              error={!!errors[locale]}
              helperText={errors[locale]}
              inputProps={{ min: 0, step: 1 }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => handleRemoveEntry(locale)}
              disabled={disabled}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={handleAddEntry}
        disabled={disabled}
        variant="outlined"
        size="small"
      >
        {strings.numberElement.addLocaleButton}
      </Button>
    </Box>
  );
};

