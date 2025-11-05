import React, { useState, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { DateElementForm } from "../../form/element/date/DateElementForm";
import { useCertificateElementStates } from "../../CertificateElementContext";
import { useElementCreateMutations } from "../../form/hooks/useElementCreateMutations";
import { fontsQueryDocument } from "@/client/views/font/hooks/font.documents";
import { validateBaseElementField } from "../../form/element/base/cretElementBaseValidator";
import { validateTextPropsField } from "../../form/element/textProps/textPropsValidator";
import { validateDateDataSource, validateDateProps } from "../../form/element/date/dateValidators";
import type {
  DateElementFormState,
  DateElementFormErrors,
} from "../../form/element/date/types";
import type { UpdateBaseElementFn } from "../../form/element/base";
import type { UpdateTextPropsFn } from "../../form/element/textProps";
import type { UpdateDatePropsFn } from "../../form/element/date/types";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale/useAppTranslation";

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface CreateDateElementWrapperProps {
  templateId: number;
  // Pre-configured data source (mutually exclusive)
  initialStudentField?: GQL.StudentDateField;
  initialCertificateField?: GQL.CertificateDateField;
  initialTemplateDateVariable?: { variableId: number };
  // Pre-configured transformation
  initialTransformation?: GQL.DateTransformationType;
  // 
  initialElementName: string;

  // Dialog mode (for compact layout)
  open?: boolean;
  onClose?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CreateDateElementWrapper: React.FC<
  CreateDateElementWrapperProps
> = ({
  templateId,
  initialStudentField,
  initialCertificateField,
  initialTemplateDateVariable,
  initialTransformation,
  initialElementName,
  open,
  onClose,
}) => {
    const { templateEditorTranslations: {addNodePanel: t} } = useAppTranslation();
  
  // Get context data
  const { dateVariables, config } =
    useCertificateElementStates();
  const language = config.state.language;

  // Query fonts
  const { data: fontsData } = useQuery(fontsQueryDocument);
  const selfHostedFonts = useMemo(() => {
    return fontsData?.fonts.data || [];
  }, [fontsData?.fonts]);

  // Get mutation
  const { createDateElementMutation } = useElementCreateMutations();

  // ============================================================================
  // STATE INITIALIZATION
  // ============================================================================

  const getInitialDataSource = useCallback((): GQL.DateDataSourceInput => {
    if (initialStudentField) {
      return { studentField: { field: initialStudentField } };
    }
    if (initialCertificateField) {
      return { certificateField: { field: initialCertificateField } };
    }
    if (initialTemplateDateVariable) {
      return {
        templateVariable: {
          variableId: initialTemplateDateVariable.variableId,
        },
      };
    }
    // Default to static value
    return { static: { value: "" } };
  }, [
    initialStudentField,
    initialCertificateField,
    initialTemplateDateVariable,
  ]);

  const getInitialState = useCallback((): DateElementFormState => {
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
      dateProps: {
        format: "YYYY-MM-DD",
        calendarType: GQL.CalendarType.Gregorian,
        offsetDays: 0,
        ...(initialTransformation && { transformation: initialTransformation }),
      },
      dataSource: getInitialDataSource(),
    };
  }, [templateId, initialElementName, initialTransformation, getInitialDataSource]);

  const [state, setState] = useState<DateElementFormState>(getInitialState);
  const [errors, setErrors] = useState<DateElementFormErrors>({
    base: {},
    textProps: {},
    dateProps: {},
    dataSource: undefined,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseValidator = validateBaseElementField();
  const textPropsValidator = validateTextPropsField();
  const datePropsValidator = validateDateProps();
  const dataSourceValidator = validateDateDataSource();

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

  const updateDateProps: UpdateDatePropsFn = useCallback(action => {
    setState(prev => ({
      ...prev,
      dateProps: {
        ...prev.dateProps,
        [action.key]: action.value,
      },
    }));

    const error = datePropsValidator(action);
    setErrors(prev => ({
      ...prev,
      dateProps: {
        ...prev.dateProps,
        [action.key]: error,
      },
    }));
  }, []);

  const updateDataSource = useCallback(
    (dataSource: GQL.DateDataSourceInput) => {
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
      Object.values(errors.dateProps).some(error => error !== undefined) ||
      errors.dataSource !== undefined
    );
  }, [errors]);

  // SUBMISSION
  // ============================================================================

  const handleSubmit = useCallback(async () => {
    if (hasError) {
      logger.warn("Validation failed for date element creation");
      return;
    }

    setIsSubmitting(true);

    try {
      await createDateElementMutation({
        variables: {
          input: state,
        },
      });

      logger.info("Date element created successfully");

      // Reset state
      setState(getInitialState());
      setErrors({
        base: {},
        textProps: {},
        dateProps: {},
        dataSource: undefined,
      });

      // Close dialog if in dialog mode
      if (onClose) {
        onClose();
      }
    } catch (error) {
      logger.error("Failed to create date element", error);
      // Error is automatically handled by Apollo Client
    } finally {
      setIsSubmitting(false);
    }
  }, [hasError, createDateElementMutation, state, getInitialState, onClose]);

  const handleCancel = useCallback(() => {
    // Reset state
    setState(getInitialState());
    setErrors({
      base: {},
      textProps: {},
      dateProps: {},
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
    <DateElementForm
      state={state}
      errors={errors}
      updateBaseElement={updateBaseElement}
      updateTextProps={updateTextProps}
      updateDateProps={updateDateProps}
      updateDataSource={updateDataSource}
      language={language}
      dateVariables={dateVariables}
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
        <DialogTitle>Create Date Element</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
      </Dialog>
    );
  }

  return null;
};
