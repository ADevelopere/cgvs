import React, { useState, useMemo, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useQuery } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { NumberElementForm } from "../../form/element/number/NumberElementForm";
import { useCertificateElementStates } from "../../context/CertificateElementContext";
import { useElementCreateMutations } from "../../form/hooks/useElementCreateMutations";
import { fontsQueryDocument } from "@/client/views/font/hooks/font.documents";
import { validateBaseElementField } from "../../form/element/base/cretElementBaseValidator";
import { validateTextPropsField } from "../../form/element/textProps/textPropsValidator";
import { validateNumberDataSource, validateNumberProps } from "../../form/element/number/numberValidators";
import type { NumberElementFormState, NumberElementFormErrors } from "../../form/element/number/types";
import type { UpdateBaseElementFn } from "../../form/element/base";
import type { UpdateTextPropsFn } from "../../form/element/textProps";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale/useAppTranslation";

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface CreateNumberElementWrapperProps {
  templateId: number;
  // Pre-configured data source
  initialNumberVariable?: { variableId: number };
  //
  initialElementName: string;

  // Dialog mode (for compact layout)
  open?: boolean;
  onClose?: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const CreateNumberElementWrapper: React.FC<CreateNumberElementWrapperProps> = ({
  templateId,
  initialNumberVariable,
  initialElementName,
  open,
  onClose,
}) => {
  const {
    templateEditorTranslations: { addNodePanel: t },
  } = useAppTranslation();

  // Get context data
  const { numberVariables, config } = useCertificateElementStates();
  const language = config.state.language;

  // Query fonts
  const { data: fontsData } = useQuery(fontsQueryDocument);
  const selfHostedFonts = useMemo(() => {
    return fontsData?.fonts.data || [];
  }, [fontsData?.fonts]);

  // Get mutation
  const { createNumberElementMutation } = useElementCreateMutations();

  // ============================================================================
  // STATE INITIALIZATION
  // ============================================================================

  const getInitialDataSource = useCallback((): GQL.NumberDataSourceInput => {
    if (initialNumberVariable) {
      return { variableId: initialNumberVariable.variableId };
    }
    // Default to first available variable or 0
    return { variableId: numberVariables[0]?.id ?? 0 };
  }, [initialNumberVariable, numberVariables]);

  const getInitialState = useCallback((): NumberElementFormState => {
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
        templateId,
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
      numberProps: {
        mapping: {},
      },
      dataSource: getInitialDataSource(),
    };
  }, [templateId, initialElementName, getInitialDataSource]);

  const [state, setState] = useState<NumberElementFormState>(getInitialState);
  const [errors, setErrors] = useState<NumberElementFormErrors>({
    base: {},
    textProps: {},
    numberProps: {},
    dataSource: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseValidator = validateBaseElementField();
  const textPropsValidator = validateTextPropsField();
  const numberPropsValidator = validateNumberProps();
  const dataSourceValidator = validateNumberDataSource();

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
    (dataSource: GQL.NumberDataSourceInput) => {
      setState(prev => ({
        ...prev,
        dataSource,
      }));

      const error = dataSourceValidator({ key: "dataSource", value: dataSource });

      setErrors(prev => ({
        ...prev,
        dataSource: error?.dataSource || {},
      }));
    },
    [dataSourceValidator]
  );

  const updateMapping = useCallback(
    (mapping: Record<string, string>) => {
      setState(prev => ({
        ...prev,
        numberProps: {
          ...prev.numberProps,
          mapping,
        },
      }));

      const error = numberPropsValidator({
        key: "mapping",
        value: mapping,
      });

      setErrors(prev => ({
        ...prev,
        numberProps: {
          ...prev.numberProps,
          mapping: typeof error === "object" && error !== null ? error : undefined,
        },
      }));
    },
    [numberPropsValidator]
  );

  const hasError = useMemo(() => {
    return (
      Object.values(errors.base).some(error => error !== undefined) ||
      Object.values(errors.textProps).some(error => error !== undefined) ||
      Object.values(errors.numberProps).some(error => error !== undefined) ||
      Object.values(errors.dataSource).some(error => error !== undefined)
    );
  }, [errors]);

  // SUBMISSION
  // ============================================================================

  const handleSubmit = useCallback(async () => {
    if (hasError) {
      logger.warn({ caller: "CreateNumberElementWrapper" }, "Validation failed for number element creation");
      return;
    }

    setIsSubmitting(true);

    try {
      await createNumberElementMutation({
        variables: {
          input: state,
        },
      });

      logger.info({ caller: "CreateNumberElementWrapper" }, "Number element created successfully");

      // Reset state
      setState(getInitialState());
      setErrors({
        base: {},
        textProps: {},
        numberProps: {},
        dataSource: {},
      });

      // Close dialog if in dialog mode
      if (onClose) {
        onClose();
      }
    } catch (error) {
      logger.error({ caller: "CreateNumberElementWrapper" }, "Failed to create number element", error);
      // Error is automatically handled by Apollo Client
    } finally {
      setIsSubmitting(false);
    }
  }, [hasError, createNumberElementMutation, state, getInitialState, onClose]);

  const handleCancel = useCallback(() => {
    // Reset state
    setState(getInitialState());
    setErrors({
      base: {},
      textProps: {},
      numberProps: {},
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
    <NumberElementForm
      state={state}
      errors={errors}
      updateBaseElement={updateBaseElement}
      updateTextProps={updateTextProps}
      updateDataSource={updateDataSource}
      updateMapping={updateMapping}
      language={language}
      numberVariables={numberVariables}
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
        <DialogTitle>{t.createNumberElement}</DialogTitle>
        <DialogContent>{formContent}</DialogContent>
      </Dialog>
    );
  }

  return null;
};
