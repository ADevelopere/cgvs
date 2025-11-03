import React, { type FC } from "react";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import {
  CalendarType,
  DateTransformationType,
} from "@/client/graphql/generated/gql/graphql";
import type {
  DatePropsFieldErrors,
  DatePropsState,
  UpdateDatePropsFieldsFn,
} from "./types";

interface DatePropsFormProps {
  dateProps: DatePropsState;
  onUpdate: UpdateDatePropsFieldsFn;
  errors: DatePropsFieldErrors;
  disabled?: boolean;
}

const transformationOptions = [
  {
    value: "AGE_CALCULATION" as DateTransformationType,
    label: "AGE_CALCULATION",
  },
];

export const DatePropsForm: FC<DatePropsFormProps> = ({
  dateProps,
  onUpdate,
  errors,
  disabled,
}) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  const selectedTransformation =
    transformationOptions.find(opt => opt.value === dateProps.transformation) ||
    null;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label={strings.dateElement.formatLabel}
            placeholder={strings.dateElement.formatPlaceholder}
            value={dateProps.format || ""}
            onChange={e => onUpdate({ key: "format", value: e.target.value })}
            error={!!errors?.format}
            helperText={errors?.format || strings.dateElement.formatHelper}
            disabled={disabled}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl
            component="fieldset"
            disabled={disabled}
            error={!!errors?.calendarType}
          >
            <FormLabel component="legend">
              {strings.dateElement.calendarTypeLabel}
            </FormLabel>
            <RadioGroup
              row
              value={dateProps.calendarType || CalendarType.Gregorian}
              onChange={e =>
                onUpdate({
                  key: "calendarType",
                  value: e.target.value as CalendarType,
                })
              }
            >
              <FormControlLabel
                value={CalendarType.Gregorian}
                control={<Radio />}
                label={strings.dateElement.calendarTypeGregorian}
              />
              <FormControlLabel
                value={CalendarType.Hijri}
                control={<Radio />}
                label={strings.dateElement.calendarTypeHijri}
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            type="number"
            label={strings.dateElement.offsetDaysLabel}
            placeholder={strings.dateElement.offsetDaysPlaceholder}
            value={
              dateProps.offsetDays === undefined ? "" : dateProps.offsetDays
            }
            onChange={e =>
              onUpdate({
                key: "offsetDays",
                value: Number.parseInt(e.target.value, 10),
              })
            }
            error={!!errors?.offsetDays}
            helperText={
              errors?.offsetDays || strings.dateElement.offsetDaysHelper
            }
            disabled={disabled}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Autocomplete
            value={selectedTransformation}
            options={transformationOptions}
            getOptionLabel={option => {
              if (option.value === "AGE_CALCULATION") {
                return strings.dateElement.transformationAgeCalculation;
              }
              return option.label;
            }}
            onChange={(_event, newValue) => {
              onUpdate({
                key: "transformation",
                value: newValue?.value || null,
              });
            }}
            disabled={disabled}
            clearText={strings.dateElement.clearTransformation}
            closeText={strings.dateElement.closeTransformation}
            renderInput={params => (
              <TextField
                {...params}
                label={strings.dateElement.transformationLabel}
                placeholder={strings.dateElement.transformationPlaceholder}
                error={!!errors?.transformation}
                helperText={errors?.transformation}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
