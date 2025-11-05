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
import { ElementAlignment } from "@/client/graphql/generated/gql/graphql";
import {
  BaseCertificateElementFormState,
  BaseElementFormErrors,
  UpdateBaseElementFn,
} from "./types";

interface BaseCertificateElementFormProps {
  baseProps: BaseCertificateElementFormState;
  onFieldChange: UpdateBaseElementFn;
  errors: BaseElementFormErrors;
  disabled?: boolean;
  showTitle?: boolean;
}
type AlignmentOption = {
  label: string;
  value: ElementAlignment;
};

export const BaseCertificateElementForm: FC<
  BaseCertificateElementFormProps
> = ({ baseProps, onFieldChange, errors, disabled, showTitle = true }) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  const alignments: AlignmentOption[] = React.useMemo(
    () => [
      {
        label: strings.baseElement.alignmentTopStart,
        value: ElementAlignment.TopStart,
      },
      {
        label: strings.baseElement.alignmentTopCenter,
        value: ElementAlignment.TopCenter,
      },
      {
        label: strings.baseElement.alignmentTopEnd,
        value: ElementAlignment.TopEnd,
      },
      {
        label: strings.baseElement.alignmentCenterStart,
        value: ElementAlignment.CenterStart,
      },
      {
        label: strings.baseElement.alignmentCenter,
        value: ElementAlignment.Center,
      },
      {
        label: strings.baseElement.alignmentCenterEnd,
        value: ElementAlignment.CenterEnd,
      },
      {
        label: strings.baseElement.alignmentBottomStart,
        value: ElementAlignment.BottomStart,
      },
      {
        label: strings.baseElement.alignmentBottomCenter,
        value: ElementAlignment.BottomCenter,
      },
      {
        label: strings.baseElement.alignmentBottomEnd,
        value: ElementAlignment.BottomEnd,
      },
      {
        label: strings.baseElement.alignmentBaselineStart,
        value: ElementAlignment.BaselineStart,
      },
      {
        label: strings.baseElement.alignmentBaselineCenter,
        value: ElementAlignment.BaselineCenter,
      },
      {
        label: strings.baseElement.alignmentBaselineEnd,
        value: ElementAlignment.BaselineEnd,
      },
    ],
    [strings]
  );
  
  return (
    <Box>
      {showTitle && (
        <Typography variant="h6" gutterBottom>
          {strings.baseElement.basePropertiesTitle}
        </Typography>
      )}

      <Grid container spacing={2}>
        {/* Name */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label={strings.baseElement.nameLabel}
            placeholder={strings.baseElement.namePlaceholder}
            value={baseProps.name}
            onChange={e =>
              onFieldChange({ key: "name", value: e.target.value })
            }
            error={!!errors.name}
            helperText={errors.name}
            disabled={disabled}
            required
          />
        </Grid>

        {/* Description */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label={strings.baseElement.descriptionLabel}
            placeholder={strings.baseElement.descriptionPlaceholder}
            value={baseProps.description}
            onChange={e =>
              onFieldChange({ key: "description", value: e.target.value })
            }
            error={!!errors.description}
            helperText={errors.description}
            disabled={disabled}
          />
        </Grid>

        {/* Position X */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label={strings.baseElement.positionXLabel}
            value={baseProps.positionX}
            onChange={e =>
              onFieldChange({
                key: "positionX",
                value: Number.parseInt(e.target.value, 10) || 0,
              })
            }
            error={!!errors.positionX}
            helperText={errors.positionX}
            disabled={disabled}
            required
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Grid>

        {/* Position Y */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label={strings.baseElement.positionYLabel}
            value={baseProps.positionY}
            onChange={e =>
              onFieldChange({
                key: "positionY",
                value: Number.parseInt(e.target.value, 10) || 0,
              })
            }
            error={!!errors.positionY}
            helperText={errors.positionY}
            disabled={disabled}
            required
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Grid>

        {/* Width */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label={strings.baseElement.widthLabel}
            value={baseProps.width}
            onChange={e =>
              onFieldChange({
                key: "width",
                value: Number.parseInt(e.target.value, 10) || 0,
              })
            }
            error={!!errors.width}
            helperText={errors.width}
            disabled={disabled}
            required
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </Grid>

        {/* Height */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label={strings.baseElement.heightLabel}
            value={baseProps.height}
            onChange={e =>
              onFieldChange({
                key: "height",
                value: Number.parseInt(e.target.value, 10) || 0,
              })
            }
            error={!!errors.height}
            helperText={errors.height}
            disabled={disabled}
            required
            slotProps={{ htmlInput: { min: 1 } }}
          />
        </Grid>

        {/* Alignment */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!errors.alignment} disabled={disabled}>
            <InputLabel>{strings.baseElement.alignmentLabel}</InputLabel>
            <Select
              value={baseProps.alignment}
              label={strings.baseElement.alignmentLabel}
              onChange={e =>
                onFieldChange({
                  key: "alignment",
                  value: e.target.value as ElementAlignment,
                })
              }
            >
              {alignments.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.alignment && (
              <FormHelperText>{errors.alignment}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
