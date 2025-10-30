import React, { type FC } from "react";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Box,
  Typography,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { CountryRepresentation } from "@/client/graphql/generated/gql/graphql";

interface CountryRepresentationSelectorProps {
  value: CountryRepresentation;
  onChange: (value: CountryRepresentation) => void;
  error?: string;
  disabled?: boolean;
}

export const CountryRepresentationSelector: FC<
  CountryRepresentationSelectorProps
> = ({ value, onChange, error, disabled = false }) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  return (
    <Box>
      <FormControl component="fieldset" error={!!error} disabled={disabled} fullWidth>
        <FormLabel component="legend">
          {strings.countryElement.representationLabel}
        </FormLabel>
        <RadioGroup
          value={value}
          onChange={e => onChange(e.target.value as CountryRepresentation)}
        >
          <FormControlLabel
            value="COUNTRY_NAME"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">
                  {strings.countryElement.representationCountryName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {strings.countryElement.representationCountryNameHelp}
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="NATIONALITY"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body1">
                  {strings.countryElement.representationNationality}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {strings.countryElement.representationNationalityHelp}
                </Typography>
              </Box>
            }
          />
        </RadioGroup>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
      
      <Typography variant="caption" color="info.main" sx={{ mt: 2, display: 'block' }}>
        ℹ️ {strings.countryElement.dataSourceInfo}
      </Typography>
    </Box>
  );
};

