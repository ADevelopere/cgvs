"use client";

import React from "react";
import * as Mui from "@mui/material";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { UpdateBaseElementFn } from "../base/types";
import { ActionButtons } from "../component/ActionButtons";
import { QrCodePropsForm } from "./QrCodePropsForm";
import {
  QrCodeElementFormErrors,
  QrCodeElementFormState,
  UpdateQRCodePropsFn,
} from "./types";

export interface QrCodeElementFormProps {
  state: QrCodeElementFormState;
  errors: QrCodeElementFormErrors;
  updateBaseElement: UpdateBaseElementFn;
  updateQrCodeProps: UpdateQRCodePropsFn;
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
    <Mui.Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Scrollable Content */}
      <Mui.Box sx={{ flexGrow: 1, overflow: "auto", pb: 2 }}>
        {/* Row: QR Code Props and Base Element */}
        <Mui.Grid container spacing={2}>
          <Mui.Grid size={{ xs: 12, md: 6 }}>
            <Mui.Paper sx={{ p: 3, height: "100%" }}>
              <QrCodePropsForm
                qrCodeProps={state.qrCodeProps}
                errors={errors.qrCodeProps}
                updateQrCodeProps={updateQrCodeProps}
                disabled={isSubmitting}
              />
            </Mui.Paper>
          </Mui.Grid>

          <Mui.Grid size={{ xs: 12, md: 6 }}>
            <Mui.Paper sx={{ p: 3, height: "100%" }}>
              <BaseCertificateElementForm
                baseProps={state.base}
                onFieldChange={updateBaseElement}
                errors={errors.base}
                disabled={isSubmitting}
              />
            </Mui.Paper>
          </Mui.Grid>
        </Mui.Grid>
      </Mui.Box>

      {/* Action Buttons (Fixed) */}
      <ActionButtons
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
      />
    </Mui.Box>
  );
};
