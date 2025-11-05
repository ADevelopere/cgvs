import React, { useState, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { QrCodeElementForm } from "../../form/element/qrcode/QrCodeElementForm";
import { useElementCreateMutations } from "../../form/hooks/useElementCreateMutations";
import { validateBaseElementField } from "../../form/element/base/cretElementBaseValidator";
import { validateQRCodeProps } from "../../form/element/qrcode/qrCodeValidators";
import type {
  QrCodeElementFormState,
  QrCodeElementFormErrors,
} from "../../form/element/qrcode/types";
import type { UpdateBaseElementFn } from "../../form/element/base";
import type { UpdateQRCodePropsFn } from "../../form/element/qrcode/types";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale/useAppTranslation";

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface CreateQRCodeElementWrapperProps {
  templateId: number;
  initialElementName: string;

  // Dialog mode (for compact layout)
  open?: boolean;
  onClose?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CreateQRCodeElementWrapper: React.FC<
  CreateQRCodeElementWrapperProps
> = ({
  templateId,
  initialElementName,
  open,
  onClose,
}) => {
    const { templateEditorTranslations: {addNodePanel: t} } = useAppTranslation();
  
  // Get mutation
  const { createQRCodeElementMutation } = useElementCreateMutations();

  // ============================================================================
  // STATE INITIALIZATION
  // ============================================================================

  const getInitialState = useCallback((): QrCodeElementFormState => {
    if (!templateId) {
      throw new Error("Template ID is required");
    }

    return {
      base: {
        name: initialElementName,
        description: "",
        positionX: 100,
        positionY: 100,
        width: 200,
        height: 200,
        alignment: GQL.ElementAlignment.Center,
        renderOrder: 1,
        templateId,
        hidden: false,
      },
      qrCodeProps: {
        foregroundColor: "#000000",
        backgroundColor: "#FFFFFF",
        errorCorrection: GQL.QrCodeErrorCorrection.M,
      },
    };
  }, [templateId, initialElementName]);

  const [state, setState] = useState<QrCodeElementFormState>(getInitialState);
  const [errors, setErrors] = useState<QrCodeElementFormErrors>({
    base: {},
    qrCodeProps: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseValidator = validateBaseElementField();
  const qrCodePropsValidator = validateQRCodeProps();

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

  const updateQrCodeProps: UpdateQRCodePropsFn = useCallback(action => {
    setState(prev => ({
      ...prev,
      qrCodeProps: {
        ...prev.qrCodeProps,
        [action.key]: action.value,
      },
    }));

    const error = qrCodePropsValidator(action);
    setErrors(prev => ({
      ...prev,
      qrCodeProps: {
        ...prev.qrCodeProps,
        [action.key]: error,
      },
    }));
  }, [qrCodePropsValidator]);

  const hasError = useMemo(() => {
    return (
      Object.values(errors.base).some(error => error !== undefined) ||
      Object.values(errors.qrCodeProps).some(error => error !== undefined)
    );
  }, [errors]);

  // SUBMISSION
  // ============================================================================

  const handleSubmit = useCallback(async () => {
    if (hasError) {
      logger.warn("Validation failed for QR code element creation");
      return;
    }

    setIsSubmitting(true);

    try {
      await createQRCodeElementMutation({
        variables: {
          input: state,
        },
      });

      logger.info("QR code element created successfully");

      // Reset state
      setState(getInitialState());
      setErrors({
        base: {},
        qrCodeProps: {},
      });

      // Close dialog if in dialog mode
      if (onClose) {
        onClose();
      }
    } catch (error) {
      logger.error("Failed to create QR code element", error);
      // Error is automatically handled by Apollo Client
    } finally {
      setIsSubmitting(false);
    }
  }, [hasError, createQRCodeElementMutation, state, getInitialState, onClose]);

  const handleCancel = useCallback(() => {
    // Reset state
    setState(getInitialState());
    setErrors({
      base: {},
      qrCodeProps: {},
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
    <QrCodeElementForm
      state={state}
      errors={errors}
      updateBaseElement={updateBaseElement}
      updateQrCodeProps={updateQrCodeProps}
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
        <DialogTitle>{t.createQrCodeElement}</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
      </Dialog>
    );
  }

  return null;
};
