"use client";

import React from "react";
import * as Mui from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { QrCodeErrorCorrection } from "@/client/graphql/generated/gql/graphql";
import { QRCodePropsFormState, QRCodePropsFormErrors, UpdateQRCodePropsFn } from "./types";

export interface QrCodePropsFormProps {
  qrCodeProps: QRCodePropsFormState;
  errors: QRCodePropsFormErrors;
  updateQrCodeProps: UpdateQRCodePropsFn;
  disabled?: boolean;
}

export const QrCodePropsForm: React.FC<QrCodePropsFormProps> = ({
  qrCodeProps,
  errors,
  updateQrCodeProps,
  disabled = false,
}) => {
  const { certificateElementsTranslations: strings } = useAppTranslation();

  const errorCorrectionOptions: Array<{
    value: QrCodeErrorCorrection;
    label: string;
    description: string;
  }> = [
    {
      value: QrCodeErrorCorrection.L,
      label: strings.qrCodeElement.errorCorrectionL,
      description: strings.qrCodeElement.errorCorrectionLDesc,
    },
    {
      value: QrCodeErrorCorrection.M,
      label: strings.qrCodeElement.errorCorrectionM,
      description: strings.qrCodeElement.errorCorrectionMDesc,
    },
    {
      value: QrCodeErrorCorrection.Q,
      label: strings.qrCodeElement.errorCorrectionQ,
      description: strings.qrCodeElement.errorCorrectionQDesc,
    },
    {
      value: QrCodeErrorCorrection.H,
      label: strings.qrCodeElement.errorCorrectionH,
      description: strings.qrCodeElement.errorCorrectionHDesc,
    },
  ];

  return (
    <Mui.Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Foreground Color */}
      <Mui.Box>
        <Mui.TextField
          fullWidth
          label={strings.qrCodeElement.foregroundColorLabel}
          placeholder="#000000"
          value={qrCodeProps.foregroundColor}
          onChange={e => updateQrCodeProps({ key: "foregroundColor", value: e.target.value })}
          error={Boolean(errors.foregroundColor)}
          helperText={errors.foregroundColor || strings.qrCodeElement.foregroundColorHelper}
          disabled={disabled}
          required
          slotProps={{
            input: {
              startAdornment: (
                <Mui.InputAdornment position="start">
                  <Mui.Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      backgroundColor: qrCodeProps.foregroundColor || "#000000",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                </Mui.InputAdornment>
              ),
            },
          }}
        />
      </Mui.Box>

      {/* Background Color */}
      <Mui.Box>
        <Mui.TextField
          fullWidth
          label={strings.qrCodeElement.backgroundColorLabel}
          placeholder="#FFFFFF"
          value={qrCodeProps.backgroundColor}
          onChange={e => updateQrCodeProps({ key: "backgroundColor", value: e.target.value })}
          error={Boolean(errors.backgroundColor)}
          helperText={errors.backgroundColor || strings.qrCodeElement.backgroundColorHelper}
          disabled={disabled}
          required
          slotProps={{
            input: {
              startAdornment: (
                <Mui.InputAdornment position="start">
                  <Mui.Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: 1,
                      backgroundColor: qrCodeProps.backgroundColor || "#FFFFFF",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                </Mui.InputAdornment>
              ),
            },
          }}
        />
      </Mui.Box>

      {/* Error Correction Level */}
      <Mui.FormControl error={Boolean(errors.errorCorrection)} disabled={disabled}>
        <Mui.FormLabel required>{strings.qrCodeElement.errorCorrectionLabel}</Mui.FormLabel>
        <Mui.FormHelperText sx={{ mt: 0.5, mb: 1 }}>{strings.qrCodeElement.errorCorrectionHelper}</Mui.FormHelperText>
        <Mui.RadioGroup
          value={qrCodeProps.errorCorrection}
          onChange={e =>
            updateQrCodeProps({
              key: "errorCorrection",
              value: e.target.value as QrCodeErrorCorrection,
            })
          }
          sx={{ mt: 1 }}
        >
          {errorCorrectionOptions.map(option => (
            <Mui.Box
              key={option.value}
              sx={{
                border: 1,
                borderColor: qrCodeProps.errorCorrection === option.value ? "primary.main" : "divider",
                borderRadius: 1,
                p: 1.5,
                mb: 1,
                backgroundColor: qrCodeProps.errorCorrection === option.value ? "action.selected" : "background.paper",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: qrCodeProps.errorCorrection === option.value ? "primary.main" : "primary.light",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Mui.FormControlLabel
                value={option.value}
                control={<Mui.Radio />}
                label={
                  <Mui.Box>
                    <Mui.Typography variant="body1" fontWeight="medium">
                      {option.label}
                    </Mui.Typography>
                    <Mui.Typography variant="body2" color="text.secondary">
                      {option.description}
                    </Mui.Typography>
                  </Mui.Box>
                }
              />
            </Mui.Box>
          ))}
        </Mui.RadioGroup>
        {errors.errorCorrection && <Mui.FormHelperText error>{errors.errorCorrection}</Mui.FormHelperText>}
      </Mui.FormControl>

      {/* Info Message */}
      <Mui.Alert severity="info" sx={{ mt: 1 }}>
        {strings.qrCodeElement.dataSourceInfo}
      </Mui.Alert>
    </Mui.Box>
  );
};
