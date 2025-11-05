import React, { useState, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { TextElementForm } from "../../form/element/text/TextElementForm";
import { useCertificateElementStates } from "../../CertificateElementContext";
import { useElementCreateMutations } from "../../form/hooks/useElementCreateMutations";
import { fontsQueryDocument } from "@/client/views/font/hooks/font.documents";
import { validateBaseElementField } from "../../form/element/base/cretElementBaseValidator";
import { validateTextPropsField } from "../../form/element/textProps/textPropsValidator";
import { validateTextDataSource } from "../../form/element/text/textValidators";
import type {
  TextElementFormState,
  TextElementFormErrors,
} from "../../form/element/text/types";
import type { UpdateBaseElementFn } from "../../form/element/base";
import type { UpdateTextPropsFn } from "../../form/element/textProps";
import { logger } from "@/client/lib/logger";

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface CreateTextElementWrapperProps {
  templateId: number;
  // Pre-configured data source (mutually exclusive)
  initialStudentField?: GQL.StudentTextField;
  initialCertificateField?: GQL.CertificateTextField;
  initialTemplateTextVariable?: { variableId: number };
  initialTemplateSelectVariable?: { variableId: number };

  // Dialog mode (for compact layout)
  open?: boolean;
  onClose?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CreateTextElementWrapper: React.FC<
  CreateTextElementWrapperProps
> = ({
  templateId,
  initialStudentField,
  initialCertificateField,
  initialTemplateTextVariable,
  initialTemplateSelectVariable,
  open,
  onClose,
}) => {
  // Get context data
  const { textVariables, selectVariables, config } =
    useCertificateElementStates();
  const language = config.state.language;

  // Query fonts
  const { data: fontsData } = useQuery(fontsQueryDocument);
  const selfHostedFonts = useMemo(() => {
    return fontsData?.fonts.data || [];
  }, [fontsData?.fonts]);

  // Get mutation
  const { createTextElementMutation } = useElementCreateMutations();

  // ============================================================================
  // STATE INITIALIZATION
  // ============================================================================

  const getInitialDataSource = useCallback((): GQL.TextDataSourceInput => {
    if (initialStudentField) {
      return { studentField: { field: initialStudentField } };
    }
    if (initialCertificateField) {
      return { certificateField: { field: initialCertificateField } };
    }
    if (initialTemplateTextVariable) {
      return {
        templateTextVariable: {
          variableId: initialTemplateTextVariable.variableId,
        },
      };
    }
    if (initialTemplateSelectVariable) {
      return {
        templateSelectVariable: {
          variableId: initialTemplateSelectVariable.variableId,
        },
      };
    }
    // Default to static value
    return { static: { value: "Sample Text" } };
  }, [
    initialStudentField,
    initialCertificateField,
    initialTemplateTextVariable,
    initialTemplateSelectVariable,
  ]);

  const getInitialState = useCallback((): TextElementFormState => {
    if (!templateId) {
      throw new Error("Template ID is required");
    }

    return {
      base: {
        name: "New Text Element",
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
      dataSource: getInitialDataSource(),
    };
  }, [templateId, getInitialDataSource]);

  const [state, setState] = useState<TextElementFormState>(getInitialState);
  const [errors, setErrors] = useState<TextElementFormErrors>({
    base: {},
    textProps: {},
    dataSource: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseValidator = validateBaseElementField();
  const textPropsValidator = validateTextPropsField();
  const dataSourceValidator = validateTextDataSource();

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

  const updateDataSource = useCallback(
    (dataSource: GQL.TextDataSourceInput) => {
      setState(prev => ({
        ...prev,
        dataSource,
      }));

      const error = dataSourceValidator({ key: "dataSource", value: dataSource });
      
      setErrors(prev => ({
        ...prev,
        dataSource: error,
      }));
    },
    []
  );

  const hasError = useMemo(() => {
    return (
      Object.values(errors.base).some(error => error !== undefined) ||
      Object.values(errors.textProps).some(error => error !== undefined) ||
      errors.dataSource !== undefined
    );
  }, [errors]);

  // SUBMISSION
  // ============================================================================

  const handleSubmit = useCallback(async () => {
    if (hasError) {
      logger.warn("Validation failed for text element creation");
      return;
    }

    setIsSubmitting(true);

    try {
      await createTextElementMutation({
        variables: {
          input: state,
        },
      });

      logger.info("Text element created successfully");

      // Reset state
      setState(getInitialState());
      setErrors({
        base: {},
        textProps: {},
        dataSource: undefined,
      });

      // Close dialog if in dialog mode
      if (onClose) {
        onClose();
      }
    } catch (error) {
      logger.error("Failed to create text element", error);
      // Error is automatically handled by Apollo Client
    } finally {
      setIsSubmitting(false);
    }
  }, [hasError, createTextElementMutation, state, getInitialState, onClose]);

  const handleCancel = useCallback(() => {
    // Reset state
    setState(getInitialState());
    setErrors({
      base: {},
      textProps: {},
      dataSource: undefined,
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
    <TextElementForm
      state={state}
      errors={errors}
      updateBaseElement={updateBaseElement}
      updateTextProps={updateTextProps}
      updateDataSource={updateDataSource}
      language={language}
      textVariables={textVariables}
      selectVariables={selectVariables}
      selfHostedFonts={selfHostedFonts}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
      submitLabel="Create Element"
    />
  );

  // If open prop is provided, render in dialog
  if (open !== undefined) {
    return (
      <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
        <DialogTitle>Create Text Element</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
      </Dialog>
    );
  }

  // Otherwise render form directly
  return formContent;
};
