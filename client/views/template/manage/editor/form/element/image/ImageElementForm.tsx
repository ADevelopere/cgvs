"use client";

import React from "react";
import * as MUI from "@mui/material";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { UpdateBaseElementFn } from "../base/types";
import { ActionButtons } from "../component/ActionButtons";
import { ImageDataSourceForm } from "./ImageDataSourceForm";
import { ImagePropsForm } from "./ImagePropsForm";
import {
  ImageElementFormErrors,
  ImageElementFormState,
  UpdateImageDataSourceFn,
  UpdateImagePropsFn,
} from "./types";

export interface ImageElementFormProps {
  state: ImageElementFormState;
  errors: ImageElementFormErrors;
  updateBaseElement: UpdateBaseElementFn;
  updateImageProps: UpdateImagePropsFn;
  updateDataSource: UpdateImageDataSourceFn;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export const ImageElementForm: React.FC<ImageElementFormProps> = ({
  state,
  errors,
  updateBaseElement,
  updateImageProps,
  updateDataSource,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel,
}) => {
  return (
    <MUI.Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Scrollable Content */}
      <MUI.Box sx={{ flexGrow: 1, overflow: "auto", pb: 2 }}>
        {/* Row 1: Data Source */}
        <MUI.Paper sx={{ p: 3, mb: 2 }}>
          <ImageDataSourceForm
            dataSource={state.dataSource}
            errors={errors.dataSource}
            updateDataSource={updateDataSource}
            disabled={isSubmitting}
          />
        </MUI.Paper>

        {/* Row 2: Image Props and Base Element */}
        <MUI.Grid container spacing={2}>
          <MUI.Grid size={{ xs: 12, md: 6 }}>
            <MUI.Paper sx={{ p: 3, mb: 2 }}>
              <ImagePropsForm
                imageProps={state.imageProps}
                errors={errors.imageProps}
                updateImageProps={updateImageProps}
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

      {/* Row 3: Action Buttons (Fixed) */}
      <ActionButtons
        onSubmit={onSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
      />
    </MUI.Box>
  );
};
