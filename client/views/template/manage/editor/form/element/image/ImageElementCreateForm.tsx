"use client";

import React, { useState, useCallback } from "react";
import * as MUI from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { ImageElementCreateInput } from "@/client/graphql/generated/gql/graphql";
import { BaseCertificateElementForm } from "../base/BaseCertificateElementForm";
import { validateBaseElementField, UpdateBaseElementFn } from "../base/types";
import { ActionButtons } from "../component/ActionButtons";
import { ImageDataSourceForm } from "./ImageDataSourceForm";
import { ImagePropsForm } from "./ImagePropsForm";
import {
  ImageElementFormCreateState,
  ImageElementFormErrors,
} from "./types";
import {
  validateImageDataSource,
  validateImageProps,
} from "./imageValidators";

export interface ImageElementCreateFormProps {
  templateId: number;
  onSubmit: (input: ImageElementCreateInput) => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ImageElementCreateForm: React.FC<ImageElementCreateFormProps> = ({
  templateId,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const strings = useAppTranslation("certificateElementsTranslations");

  // Form State
  const [formState, setFormState] = useState<ImageElementFormCreateState>({
    base: {
      templateId,
      name: "",
      description: "",
      positionX: 0,
      positionY: 0,
      width: 200,
      height: 200,
      alignment: "TOP",
      renderOrder: 0,
    },
    imageProps: {
      fit: "CONTAIN",
    },
    dataSource: {
      storageFile: {
        storageFileId: -1,
      },
    },
  });

  // Errors State
  const [errors, setErrors] = useState<ImageElementFormErrors>({
    base: {},
    imageProps: {},
    dataSource: {},
  });

  // Update base element fields
  const updateBase = useCallback(
    <K extends keyof typeof formState.base>(
      key: K,
      value: (typeof formState.base)[K]
    ) => {
      setFormState(prev => ({
        ...prev,
        base: { ...prev.base, [key]: value },
      }));

      // Validate field
      const error = validateBaseElementField(key, value);
      setErrors(prev => ({
        ...prev,
        base: { ...prev.base, [key]: error },
      }));
    },
    []
  );

  // Update image props
  const updateImageProps = useCallback(
    <K extends keyof typeof formState.imageProps>(
      key: K,
      value: (typeof formState.imageProps)[K]
    ) => {
      setFormState(prev => ({
        ...prev,
        imageProps: { ...prev.imageProps, [key]: value },
      }));

      // Clear error for this field
      setErrors(prev => ({
        ...prev,
        imageProps: { ...prev.imageProps, [key]: undefined },
      }));
    },
    []
  );

  // Update data source
  const updateDataSource = useCallback(
    (dataSource: typeof formState.dataSource) => {
      setFormState(prev => ({
        ...prev,
        dataSource,
      }));

      // Validate data source
      const dataSourceErrors = validateImageDataSource(dataSource);
      setErrors(prev => ({
        ...prev,
        dataSource: dataSourceErrors,
      }));
    },
    []
  );

  // Validate entire form
  const validateForm = (): boolean => {
    const baseErrors = {
      name: validateBaseElementField("name", formState.base.name),
      description: validateBaseElementField(
        "description",
        formState.base.description
      ),
      positionX: validateBaseElementField("positionX", formState.base.positionX),
      positionY: validateBaseElementField("positionY", formState.base.positionY),
      width: validateBaseElementField("width", formState.base.width),
      height: validateBaseElementField("height", formState.base.height),
    };

    const imagePropsErrors = validateImageProps(formState.imageProps);
    const dataSourceErrors = validateImageDataSource(formState.dataSource);

    const newErrors: ImageElementFormErrors = {
      base: Object.fromEntries(
        Object.entries(baseErrors).filter(([_, v]) => v !== undefined)
      ),
      imageProps: imagePropsErrors,
      dataSource: dataSourceErrors,
    };

    setErrors(newErrors);

    return (
      Object.keys(newErrors.base).length === 0 &&
      Object.keys(newErrors.imageProps).length === 0 &&
      Object.keys(newErrors.dataSource).length === 0
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const input: ImageElementCreateInput = {
      ...formState.base,
      fit: formState.imageProps.fit,
      dataSource: formState.dataSource,
    };

    await onSubmit(input);
  };

  return (
    <MUI.Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Row 1: Data Source (Fixed) */}
      <MUI.Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <ImageDataSourceForm
          dataSource={formState.dataSource}
          errors={errors.dataSource}
          updateDataSource={updateDataSource}
          disabled={loading}
        />
      </MUI.Box>

      {/* Row 2: Properties (Scrollable) */}
      <MUI.Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
        }}
      >
        <MUI.Grid container spacing={3}>
          {/* Left Column: Image Props */}
          <MUI.Grid size={{ xs: 12, md: 6 }}>
            <ImagePropsForm
              imageProps={formState.imageProps}
              errors={errors.imageProps}
              updateImageProps={updateImageProps}
              disabled={loading}
            />
          </MUI.Grid>

          {/* Right Column: Base Element Props */}
          <MUI.Grid size={{ xs: 12, md: 6 }}>
            <BaseCertificateElementForm
              baseProps={formState.base}
              onFieldChange={updateBase as UpdateBaseElementFn}
              errors={errors.base}
              disabled={loading}
            />
          </MUI.Grid>
        </MUI.Grid>
      </MUI.Box>

      {/* Row 3: Action Buttons (Fixed) */}
      <MUI.Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <ActionButtons
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isSubmitting={loading}
          submitLabel={strings.common.create}
        />
      </MUI.Box>
    </MUI.Box>
  );
};

