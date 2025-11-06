import React from "react";
import { useMutation } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateNumberElementDataSourceMutationDocument } from "../../glqDocuments/element/number.documents";
import { validateNumberDataSource } from "../element/number/numberValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  NumberDataSourceFormState,
  NumberDataSourceFormErrors,
  UpdateNumberDataSourceWithElementIdFn,
  numberDataSourceToInput,
} from "../element/number/types";
import { useElementState } from "./useElementState";
import { useCertificateElementStates } from "../../CertificateElementContext";
import { useNotifications } from "@toolpad/core/useNotifications";

export type UseNumberDataSourceStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseNumberDataSourceStateReturn = {
  numberDataSourceStates: Map<number, NumberDataSourceFormState>;
  updateNumberDataSourceStateFn: UpdateNumberDataSourceWithElementIdFn;
  pushNumberDataSourceStateUpdate: (elementId: number) => Promise<void>;
  initNumberDataSourceState: (elementId: number) => NumberDataSourceFormState;
  numberDataSourceStateErrors: Map<number, NumberDataSourceFormErrors>;
};

/**
 * Type guard to check if element is NumberElement
 */
function isNumberElement(element: GQL.CertificateElementUnion): element is GQL.NumberElement {
  return element.__typename === "NumberElement";
}

/**
 * Extract numberDataSource state from element
 */
function extractNumberDataSourceState(element: GQL.CertificateElementUnion): NumberDataSourceFormState | null {
  if (isNumberElement(element) && element.numberDataSource) {
    return {
      dataSource: numberDataSourceToInput(element.numberDataSource),
    };
  }
  return null;
}

/**
 * Convert numberDataSource input to update input
 */
function toUpdateInput(
  elementId: number,
  state: NumberDataSourceFormState
): GQL.NumberElementDataSourceStandaloneUpdateInput {
  return {
    elementId: elementId,
    dataSource: state.dataSource,
  };
}

export function useNumberDataSourceState(params: UseNumberDataSourceStateParams): UseNumberDataSourceStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateNumberElementDataSourceMutation] = useMutation(updateNumberElementDataSourceMutationDocument);

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: NumberDataSourceFormState): Promise<void> => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateNumberElementDataSourceMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage = errorStrings?.updateFailed || "Failed to update number data source";
        logger.error({ caller: "useNumberDataSourceState" }, "Mutation failed", {
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
    [updateNumberElementDataSourceMutation, notifications, errorStrings]
  );

  const validator = validateNumberDataSource();

  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    NumberDataSourceFormState,
    NumberDataSourceFormErrors,
    NumberDataSourceFormErrors
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractNumberDataSourceState,
    mutationFn,
    stateNamespace: "numberDataSource",
  });

  return {
    numberDataSourceStates: states,
    updateNumberDataSourceStateFn: updateFn,
    pushNumberDataSourceStateUpdate: pushUpdate,
    initNumberDataSourceState: initState,
    numberDataSourceStateErrors: errors,
  };
}

export type UseNumberDataSourceParams = {
  elementId: number;
};

export const useNumberDataSource = (params: UseNumberDataSourceParams) => {
  const {
    numberDataSource: {
      numberDataSourceStates,
      updateNumberDataSourceStateFn,
      pushNumberDataSourceStateUpdate,
      initNumberDataSourceState,
      numberDataSourceStateErrors,
    },
  } = useCertificateElementStates();

  // Get state or initialize if not present (only initialize once)
  const { dataSource } = React.useMemo(() => {
    return numberDataSourceStates.get(params.elementId) ?? initNumberDataSourceState(params.elementId);
  }, [numberDataSourceStates, params.elementId, initNumberDataSourceState]);

  const updateNumberDataSource = React.useCallback(
    (dataSource: GQL.NumberDataSourceInput) => {
      updateNumberDataSourceStateFn(params.elementId, {
        key: "dataSource",
        value: dataSource,
      });
    },
    [params.elementId, updateNumberDataSourceStateFn]
  );

  const pushNumberDataSourceUpdate = React.useCallback(async () => {
    await pushNumberDataSourceStateUpdate(params.elementId);
  }, [params.elementId, pushNumberDataSourceStateUpdate]);

  const { dataSource: errors } = React.useMemo(() => {
    return (
      numberDataSourceStateErrors.get(params.elementId) || {
        dataSource: {},
      }
    );
  }, [numberDataSourceStateErrors, params.elementId]);

  return {
    numberDataSourceState: dataSource,
    updateNumberDataSource,
    pushNumberDataSourceUpdate,
    numberDataSourceErrors: errors,
  };
};
