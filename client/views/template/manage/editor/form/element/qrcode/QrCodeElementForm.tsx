"use client";

import React from "react";
import * as MUI from "@mui/material";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { UpdateBaseElementFn } from "../base/types";
import { ActionButtons } from "../component/ActionButtons";
import { QrCodePropsForm } from "./QrCodePropsForm";
import {
  QrCodeElementFormErrors,
  QrCodeElementFormState,
  UpdateQrCodePropsFn,
} from "./types";

export interface QrCodeElementFormProps {
  state: QrCodeElementFormState;
  errors: QrCodeElementFormErrors;
  updateBaseElement: UpdateBaseElementFn;
  updateQrCodeProps: UpdateQrCodePropsFn;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const QrCodeElementForm: React.FC<QrCodeElementFormProps> = ({
  state,
  errors,
  updateBaseElement,
  updateQrCodeProps,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}) => {
  return (
    <MUI.Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Scrollable Content */}
      <MUI.Box sx={{ flexGrow: 1, overflow: "auto", pb: 2 }}>
        {/* Row: QR Code Props and Base Element */}
        <MUI.Grid container spacing={2}>
          <MUI.Grid size={{ xs: 12, md: 6 }}>
            <MUI.Paper sx={{ p: 3, height: "100%" }}>
              <QrCodePropsForm
                qrCodeProps={state.qrCodeProps}
                errors={errors.qrCodeProps}
                updateQrCodeProps={updateQrCodeProps}
                disabled={isSubmitting}
              />
            </MUI.Paper>
          </MUI.Grid>

          <MUI.Grid size={{ xs: 12, md: 6 }}>
            <MUI.Paper sx={{ p: 3, height: "100%" }}>
              <BaseCertificateElementForm
                baseProps={state.base}
                onFieldChange={updateBaseElement}
                errors={errors.base}
                disabled={isSubmitting}
              />
            </MUI.Paper>
          </MUI.Grid>
        </MUI.Grid>
      </MUI.Box>

      {/* Action Buttons (Fixed) */}
      <ActionButtons
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
      />
    </MUI.Box>
  );
};
