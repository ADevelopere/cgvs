"use client";

import React from "react";
import * as MUI from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { QrCodeErrorCorrection } from "@/client/graphql/generated/gql/graphql";
import { UpdateStateFn } from "../../types";
import { QrCodePropsState, QrCodePropsFormErrors } from "./types";

export interface QrCodePropsFormProps {
  qrCodeProps: QrCodePropsState;
  errors: QrCodePropsFormErrors;
  updateQrCodeProps: UpdateStateFn<QrCodePropsState>;
  disabled?: boolean;
}

export const QrCodePropsForm: React.FC<QrCodePropsFormProps> = ({
  qrCodeProps,
  errors,
  updateQrCodeProps,
  disabled = false,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  const errorCorrectionOptions: Array<{
    value: QrCodeErrorCorrection;
    label: string;
    description: string;
  }> = [
    {
      value: "L",
      label: strings.qrCodeElement.errorCorrectionL,
      description: strings.qrCodeElement.errorCorrectionLDesc,
    },
    {
      value: "M",
      label: strings.qrCodeElement.errorCorrectionM,
      description: strings.qrCodeElement.errorCorrectionMDesc,
    },
    {
      value: "Q",
      label: strings.qrCodeElement.errorCorrectionQ,
      description: strings.qrCodeElement.errorCorrectionQDesc,
    },
    {
      value: "H",
      label: strings.qrCodeElement.errorCorrectionH,
      description: strings.qrCodeElement.errorCorrectionHDesc,
    },
  ];

  return (
    <MUI.Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Foreground Color */}
      <MUI.Box>
        <MUI.TextField
          fullWidth
          label={strings.qrCodeElement.foregroundColorLabel}
          placeholder="#000000"
          value={qrCodeProps.foregroundColor}
          onChange={e => updateQrCodeProps("foregroundColor", e.target.value)}
          error={Boolean(errors.foregroundColor)}
          helperText={
            errors.foregroundColor || strings.qrCodeElement.foregroundColorHelper
          }
          disabled={disabled}
          required
          InputProps={{
            startAdornment: (
              <MUI.InputAdornment position="start">
                <MUI.Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    backgroundColor: qrCodeProps.foregroundColor || "#000000",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
              </MUI.InputAdornment>
            ),
          }}
        />
      </MUI.Box>

      {/* Background Color */}
      <MUI.Box>
        <MUI.TextField
          fullWidth
          label={strings.qrCodeElement.backgroundColorLabel}
          placeholder="#FFFFFF"
          value={qrCodeProps.backgroundColor}
          onChange={e => updateQrCodeProps("backgroundColor", e.target.value)}
          error={Boolean(errors.backgroundColor)}
          helperText={
            errors.backgroundColor || strings.qrCodeElement.backgroundColorHelper
          }
          disabled={disabled}
          required
          InputProps={{
            startAdornment: (
              <MUI.InputAdornment position="start">
                <MUI.Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 1,
                    backgroundColor: qrCodeProps.backgroundColor || "#FFFFFF",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
              </MUI.InputAdornment>
            ),
          }}
        />
      </MUI.Box>

      {/* Error Correction Level */}
      <MUI.FormControl error={Boolean(errors.errorCorrection)} disabled={disabled}>
        <MUI.FormLabel required>
          {strings.qrCodeElement.errorCorrectionLabel}
        </MUI.FormLabel>
        <MUI.FormHelperText sx={{ mt: 0.5, mb: 1 }}>
          {strings.qrCodeElement.errorCorrectionHelper}
        </MUI.FormHelperText>
        <MUI.RadioGroup
          value={qrCodeProps.errorCorrection}
          onChange={e =>
            updateQrCodeProps(
              "errorCorrection",
              e.target.value as QrCodeErrorCorrection
            )
          }
          sx={{ mt: 1 }}
        >
          {errorCorrectionOptions.map(option => (
            <MUI.Box
              key={option.value}
              sx={{
                border: 1,
                borderColor:
                  qrCodeProps.errorCorrection === option.value
                    ? "primary.main"
                    : "divider",
                borderRadius: 1,
                p: 1.5,
                mb: 1,
                backgroundColor:
                  qrCodeProps.errorCorrection === option.value
                    ? "action.selected"
                    : "background.paper",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor:
                    qrCodeProps.errorCorrection === option.value
                      ? "primary.main"
                      : "primary.light",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <MUI.FormControlLabel
                value={option.value}
                control={<MUI.Radio />}
                label={
                  <MUI.Box>
                    <MUI.Typography variant="body1" fontWeight="medium">
                      {option.label}
                    </MUI.Typography>
                    <MUI.Typography variant="body2" color="text.secondary">
                      {option.description}
                    </MUI.Typography>
                  </MUI.Box>
                }
              />
            </MUI.Box>
          ))}
        </MUI.RadioGroup>
        {errors.errorCorrection && (
          <MUI.FormHelperText error>{errors.errorCorrection}</MUI.FormHelperText>
        )}
      </MUI.FormControl>

      {/* Info Message */}
      <MUI.Alert severity="info" sx={{ mt: 1 }}>
        {strings.qrCodeElement.dataSourceInfo}
      </MUI.Alert>
    </MUI.Box>
  );
};
