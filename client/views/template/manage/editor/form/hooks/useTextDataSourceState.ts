import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateTextElementDataSourceMutationDocument } from "../../glqDocuments/element/text.documents";
import { validateTextDataSource } from "../element/text/textValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  TextDataSourceFormState,
  TextDataSourceFormErrors,
  UpdateTextDataSourceWithElementIdFn,
  textDataSourceToInput,
  TextDataSourceFieldErrors,
} from "../element/text/types";
import { useElementState } from "./useElementState";
import { useCertificateElementStates } from "../../CertificateElementContext";

export type UseTextDataSourceStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseTextDataSourceStateReturn = {
  textDataSourceStates: Map<number, TextDataSourceFormState>;
  updateTextDataSourceStateFn: UpdateTextDataSourceWithElementIdFn;
  pushTextDataSourceStateUpdate: (elementId: number) => Promise<void>;
  initTextDataSourceState: (elementId: number) => TextDataSourceFormState;
  textDataSourceStateErrors: Map<number, TextDataSourceFormErrors>;
};

/**
 * Type guard to check if element is TextElement
 */
function isTextElement(element: GQL.CertificateElementUnion): element is GQL.TextElement {
  return element.__typename === "TextElement";
}

/**
 * Extract textDataSource state from element
 */
function extractTextDataSourceState(element: GQL.CertificateElementUnion): TextDataSourceFormState | null {
  if (isTextElement(element) && element.textDataSource) {
    return {
      dataSource: textDataSourceToInput(element.textDataSource),
    };
  }
  return null;
}

/**
 * Convert textDataSource input to update input
 */
function toUpdateInput(elementId: number, state: TextDataSourceFormState): GQL.TextDataSourceStandaloneInput {
  return {
    elementId: elementId,
    dataSource: state.dataSource,
  };
}

export function useTextDataSourceState(params: UseTextDataSourceStateParams): UseTextDataSourceStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateTextElementDataSourceMutation] = useMutation(updateTextElementDataSourceMutationDocument);

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: TextDataSourceFormState): Promise<void> => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateTextElementDataSourceMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage = errorStrings?.updateFailed || "Failed to update text data source";
        logger.error("useTextDataSourceState: Mutation failed", {
          elementId,
          error,
        });
        notifications.show(errorMessage, {
          severity: "error",
          autoHideDuration: 3000,
        });
        throw error;
      }
    },
    [updateTextElementDataSourceMutation, notifications, errorStrings]
  );

  const validator = validateTextDataSource();

  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    TextDataSourceFormState,
    TextDataSourceFormErrors,
    TextDataSourceFieldErrors
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractTextDataSourceState,
    mutationFn,
    stateNamespace: "textDataSource",
  });

  return {
    textDataSourceStates: states,
    updateTextDataSourceStateFn: updateFn,
    pushTextDataSourceStateUpdate: pushUpdate,
    initTextDataSourceState: initState,
    textDataSourceStateErrors: errors,
  };
}

export type UseTextDataSourceParams = {
  elementId: number;
};

export type TextDataSourceHook = (params: UseTextDataSourceParams) => {
  textDataSourceState: GQL.TextDataSourceInput;
  updateTextDataSource: (dataSource: GQL.TextDataSourceInput) => void;
  pushTextDataSourceUpdate: () => Promise<void>;
  textDataSourceErrors: TextDataSourceFormErrors;
};

export const useTextDataSource: TextDataSourceHook = params => {
  const {
    textDataSource: {
      textDataSourceStates,
      updateTextDataSourceStateFn,
      pushTextDataSourceStateUpdate,
      initTextDataSourceState,
      textDataSourceStateErrors,
    },
  } = useCertificateElementStates();

  // Get state or initialize if not present (only initialize once)
  const { dataSource } = React.useMemo(() => {
    return textDataSourceStates.get(params.elementId) ?? initTextDataSourceState(params.elementId);
  }, [textDataSourceStates, params.elementId, initTextDataSourceState]);

  const updateTextDataSource = React.useCallback(
    (dataSource: GQL.TextDataSourceInput) => {
      updateTextDataSourceStateFn(params.elementId, {
        key: "dataSource",
        value: dataSource,
      });
    },
    [params.elementId, updateTextDataSourceStateFn]
  );

  const pushTextDataSourceUpdate = React.useCallback(async () => {
    await pushTextDataSourceStateUpdate(params.elementId);
  }, [params.elementId, pushTextDataSourceStateUpdate]);

  const errors: TextDataSourceFormErrors = React.useMemo(() => {
    return textDataSourceStateErrors.get(params.elementId) || {};
  }, [textDataSourceStateErrors, params.elementId]);

  return {
    textDataSourceState: dataSource,
    updateTextDataSource,
    pushTextDataSourceUpdate,
    textDataSourceErrors: errors,
  };
};
