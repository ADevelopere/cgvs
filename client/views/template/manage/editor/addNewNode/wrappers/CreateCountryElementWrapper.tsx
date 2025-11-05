import React, { useState, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { CountryElementForm } from "../../form/element/country/CountryElementForm";
import { useCertificateElementStates } from "../../CertificateElementContext";
import { useElementCreateMutations } from "../../form/hooks/useElementCreateMutations";
import { fontsQueryDocument } from "@/client/views/font/hooks/font.documents";
import { validateBaseElementField } from "../../form/element/base/cretElementBaseValidator";
import { validateTextPropsField } from "../../form/element/textProps/textPropsValidator";
import { validateCountryElementCountryProps } from "../../form/element/country/countryValidators";
import type {
  CountryElementFormState,
  CountryElementFormErrors,
} from "../../form/element/country/types";
import type { UpdateBaseElementFn } from "../../form/element/base";
import type { UpdateTextPropsFn } from "../../form/element/textProps";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale/useAppTranslation";

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface CreateCountryElementWrapperProps {
  templateId: number;
  // Pre-configured representation
  initialRepresentation?: GQL.CountryRepresentation;
  // 
  initialElementName: string;

  // Dialog mode (for compact layout)
  open?: boolean;
  onClose?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CreateCountryElementWrapper: React.FC<
  CreateCountryElementWrapperProps
> = ({
  templateId,
  initialRepresentation,
  initialElementName,
  open,
  onClose,
}) => {
    const { templateEditorTranslations: {addNodePanel: t}, certificateElementsTranslations } = useAppTranslation();
  
  // Get context data
  const { config } = useCertificateElementStates();
  const language = config.state.language;

  // Query fonts
  const { data: fontsData } = useQuery(fontsQueryDocument);
  const selfHostedFonts = useMemo(() => {
    return fontsData?.fonts.data || [];
  }, [fontsData?.fonts]);

  // Get mutation
  const { createCountryElementMutation } = useElementCreateMutations();

  // ============================================================================
  // STATE INITIALIZATION
  // ============================================================================

  const getInitialState = useCallback((): CountryElementFormState => {
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
        height: 50,
        alignment: GQL.ElementAlignment.Center,
        renderOrder: 1,
        templateId,
        hidden: false,
      },
      textProps: {
        fontRef: {
          google: {
            identifier: "Roboto",
          },
        },
        fontSize: 16,
        color: "#000000",
        overflow: GQL.ElementOverflow.Wrap,
      },
      countryProps: {
        representation: initialRepresentation || GQL.CountryRepresentation.CountryName,
      },
    };
  }, [templateId, initialElementName, initialRepresentation]);

  const [state, setState] = useState<CountryElementFormState>(getInitialState);
  const [errors, setErrors] = useState<CountryElementFormErrors>({
    base: {},
    textProps: {},
    countryProps: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseValidator = validateBaseElementField();
  const textPropsValidator = validateTextPropsField();
  const countryPropsValidator = validateCountryElementCountryProps({
    representationRequired: certificateElementsTranslations.countryElement.representationRequired,
    representationInvalid: certificateElementsTranslations.countryElement.representationInvalid,
  });

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

  const updateTextProps: UpdateTextPropsFn = useCallback(action => {
    setState(prev => ({
      ...prev,
      textProps: {
        ...prev.textProps,
        [action.key]: action.value,
      },
    }));

    const error = textPropsValidator(action);
    setErrors(prev => ({
      ...prev,
      textProps: {
        ...prev.textProps,
        [action.key]: error,
      },
    }));
  }, []);

  const updateRepresentation = useCallback((representation: GQL.CountryRepresentation) => {
    setState(prev => ({
      ...prev,
      countryProps: {
        ...prev.countryProps,
        representation,
      },
    }));

    const error = countryPropsValidator({
      key: "representation",
      value: representation,
    });

    setErrors(prev => ({
      ...prev,
      countryProps: {
        ...prev.countryProps,
        representation: error,
      },
    }));
  }, [countryPropsValidator]);

  const hasError = useMemo(() => {
    return (
      Object.values(errors.base).some(error => error !== undefined) ||
      Object.values(errors.textProps).some(error => error !== undefined) ||
      Object.values(errors.countryProps).some(error => error !== undefined)
    );
  }, [errors]);

  // SUBMISSION
  // ============================================================================

  const handleSubmit = useCallback(async () => {
    if (hasError) {
      logger.warn("Validation failed for country element creation");
      return;
    }

    setIsSubmitting(true);

    try {
      await createCountryElementMutation({
        variables: {
          input: state,
        },
      });

      logger.info("Country element created successfully");

      // Reset state
      setState(getInitialState());
      setErrors({
        base: {},
        textProps: {},
        countryProps: {},
      });

      // Close dialog if in dialog mode
      if (onClose) {
        onClose();
      }
    } catch (error) {
      logger.error("Failed to create country element", error);
      // Error is automatically handled by Apollo Client
    } finally {
      setIsSubmitting(false);
    }
  }, [hasError, createCountryElementMutation, state, getInitialState, onClose]);

  const handleCancel = useCallback(() => {
    // Reset state
    setState(getInitialState());
    setErrors({
      base: {},
      textProps: {},
      countryProps: {},
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
    <CountryElementForm
      state={state}
      errors={errors}
      updateBaseElement={updateBaseElement}
      updateTextProps={updateTextProps}
      updateRepresentation={updateRepresentation}
      locale={language}
      selfHostedFonts={selfHostedFonts}
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
        <DialogTitle>Create Country Element</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
      </Dialog>
    );
  }

  return null;
};
