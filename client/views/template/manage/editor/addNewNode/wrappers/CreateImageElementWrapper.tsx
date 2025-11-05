import React, { useState, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { ImageElementForm } from "../../form/element/image/ImageElementForm";
import { useElementCreateMutations } from "../../form/hooks/useElementCreateMutations";
import { validateBaseElementField } from "../../form/element/base/cretElementBaseValidator";
import { validateImageDataSource, validateImageProps } from "../../form/element/image/imageValidators";
import type {
  ImageElementFormState,
  ImageElementFormErrors,
} from "../../form/element/image/types";
import type { UpdateBaseElementFn } from "../../form/element/base";
import type { UpdateImagePropsFn } from "../../form/element/image/types";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale/useAppTranslation";

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface CreateImageElementWrapperProps {
  templateId: number;
  // Pre-configured image file
  initialStorageFileId?: number;
  // Pre-configured image fit
  initialFit?: GQL.ElementImageFit;
  // 
  initialElementName: string;

  // Dialog mode (for compact layout)
  open?: boolean;
  onClose?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CreateImageElementWrapper: React.FC<
  CreateImageElementWrapperProps
> = ({
  templateId,
  initialStorageFileId,
  initialFit,
  initialElementName,
  open,
  onClose,
}) => {
    const { templateEditorTranslations: {addNodePanel: t} } = useAppTranslation();

  // Get mutation
  const { createImageElementMutation } = useElementCreateMutations();

  // ============================================================================
  // STATE INITIALIZATION
  // ============================================================================

  const getInitialState = useCallback((): ImageElementFormState => {
    if (!templateId) {
      throw new Error("Template ID is required");
    }

    return {
      base: {
        name: initialElementName,
        description: "",
        positionX: 100,
        positionY: 100,
        width: 300,
        height: 300,
        alignment: GQL.ElementAlignment.Center,
        renderOrder: 1,
        templateId,
        hidden: false,
      },
      imageProps: {
        fit: initialFit || GQL.ElementImageFit.Contain,
      },
      dataSource: {
        storageFile: {
          storageFileId: initialStorageFileId || -1,
        },
      },
    };
  }, [templateId, initialElementName, initialFit, initialStorageFileId]);

  const [state, setState] = useState<ImageElementFormState>(getInitialState);
  const [errors, setErrors] = useState<ImageElementFormErrors>({
    base: {},
    imageProps: {},
    dataSource: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseValidator = validateBaseElementField();
  const imagePropsValidator = validateImageProps();

  // ============================================================================
  // UPDATE FUNCTIONS
  // ============================================================================

  const updateBaseElement: UpdateBaseElementFn = useCallback(action => {
    setState(prev => ({
      ...prev,
      base: {
        ...prev.base,
        [action.key]: action.value,
      },
    }));

    const error = baseValidator(action);

    setErrors(prev => ({
      ...prev,
      base: {
        ...prev.base,
        [action.key]: error,
      },
    }));
  }, []);

  const updateImageProps: UpdateImagePropsFn = useCallback(action => {
    setState(prev => ({
      ...prev,
      imageProps: {
        ...prev.imageProps,
        [action.key]: action.value,
      },
    }));

    const error = imagePropsValidator(action);
    setErrors(prev => ({
      ...prev,
      imageProps: {
        ...prev.imageProps,
        [action.key]: error,
      },
    }));
  }, []);

  const updateDataSource = useCallback(
    (dataSource: GQL.ImageDataSourceInput) => {
      setState(prev => ({
        ...prev,
        dataSource,
      }));

      const dataSourceErrors = validateImageDataSource(dataSource);
      
      setErrors(prev => ({
        ...prev,
        dataSource: dataSourceErrors,
      }));
    },
    []
  );

  const hasError = useMemo(() => {
    return (
      Object.values(errors.base).some(error => error !== undefined) ||
      Object.values(errors.imageProps).some(error => error !== undefined) ||
      Object.values(errors.dataSource).some(error => error !== undefined)
    );
  }, [errors]);

  // SUBMISSION
  // ============================================================================

  const handleSubmit = useCallback(async () => {
    if (hasError) {
      logger.warn("Validation failed for image element creation");
      return;
    }

    setIsSubmitting(true);

    try {
      await createImageElementMutation({
        variables: {
          input: state,
        },
      });

      logger.info("Image element created successfully");

      // Reset state
      setState(getInitialState());
      setErrors({
        base: {},
        imageProps: {},
        dataSource: {},
      });

      // Close dialog if in dialog mode
      if (onClose) {
        onClose();
      }
    } catch (error) {
      logger.error("Failed to create image element", error);
      // Error is automatically handled by Apollo Client
    } finally {
      setIsSubmitting(false);
    }
  }, [hasError, createImageElementMutation, state, getInitialState, onClose]);

  const handleCancel = useCallback(() => {
    // Reset state
    setState(getInitialState());
    setErrors({
      base: {},
      imageProps: {},
      dataSource: {},
    });

    // Close dialog if in dialog mode
    if (onClose) {
      onClose();
    }
  }, [getInitialState, onClose]);

  // ============================================================================
  // RENDER
  // ============================================================================

  const formContent = (
    <ImageElementForm
      state={state}
      errors={errors}
      updateBaseElement={updateBaseElement}
      updateImageProps={updateImageProps}
      updateDataSource={updateDataSource}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      submitLabel={t.create}
    />
  );

  // If open prop is provided, render in dialog
  if (open !== undefined) {
    return (
      <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
        <DialogTitle>{t.createImageElement}</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
      </Dialog>
    );
  }

  return null;
};
