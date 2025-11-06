import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateNumberElementSpecPropsMutationDocument } from "../../glqDocuments/element/number.documents";
import { useElementState } from "./useElementState";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  NumberPropsFormState,
  NumberPropsFormErrors,
  UpdateNumberPropsWithElementIdFn,
  NumberMappingFormErrors,
  UpdateNumberPropsFn,
} from "../element/number";
import { validateNumberProps } from "../element/number/numberValidators";
import { useCertificateElementStates } from "../../CertificateElementContext";

export type UseNumberPropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseNumberPropsStateReturn = {
  numberPropsStates: Map<number, NumberPropsFormState>;
  updateNumberPropsStateFn: UpdateNumberPropsWithElementIdFn;
  pushNumberPropsStateUpdate: (elementId: number) => Promise<void>;
  initNumberPropsState: (elementId: number) => NumberPropsFormState;
  numberPropsStateErrors: Map<number, NumberPropsFormErrors>;
};

/**
 * Extract numberProps state from NumberElement
 */
function extractNumberPropsState(element: GQL.CertificateElementUnion): NumberPropsFormState | null {
  if (element.__typename !== "NumberElement" || !element.numberProps) {
    return null;
  }

  return {
    mapping: element.numberProps.mapping ?? {},
  };
}

/**
 * Convert numberProps input to update input
 */
function toUpdateInput(
  elementId: number,
  state: NumberPropsFormState
): GQL.NumberElementSpecPropsStandaloneUpdateInput {
  return {
    elementId: elementId,
    numberProps: {
      mapping: state.mapping,
    },
  };
}

export function useNumberPropsState(params: UseNumberPropsStateParams): UseNumberPropsStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateNumberElementSpecPropsMutation] = useMutation(updateNumberElementSpecPropsMutationDocument);

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: NumberPropsFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateNumberElementSpecPropsMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage = errorStrings?.updateFailed || "Failed to update number properties";
        logger.error("useNumberPropsState: Mutation failed", {
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
    [updateNumberElementSpecPropsMutation, notifications, errorStrings]
  );

  // Use generic hook
  const validator = validateNumberProps();

  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    NumberPropsFormState,
    NumberPropsFormErrors,
    string | NumberMappingFormErrors | undefined
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractNumberPropsState,
    mutationFn,
    stateNamespace: "numberProps",
  });

  return {
    numberPropsStates: states,
    updateNumberPropsStateFn: updateFn,
    pushNumberPropsStateUpdate: pushUpdate,
    initNumberPropsState: initState,
    numberPropsStateErrors: errors,
  };
}

export type UseNumberPropsParams = {
  elementId: number;
};

export const useNumberProps = (params: UseNumberPropsParams) => {
  const {
    numberProps: {
      numberPropsStates,
      updateNumberPropsStateFn,
      pushNumberPropsStateUpdate,
      initNumberPropsState,
      numberPropsStateErrors,
    },
  } = useCertificateElementStates();

  // Get state or initialize if not present (only initialize once)
  const numberProps: NumberPropsFormState = React.useMemo(() => {
    return numberPropsStates.get(params.elementId) ?? initNumberPropsState(params.elementId);
  }, [numberPropsStates, params.elementId, initNumberPropsState]);

  const updateNumberProps: UpdateNumberPropsFn = React.useCallback(
    action => {
      updateNumberPropsStateFn(params.elementId, action);
    },
    [params.elementId, updateNumberPropsStateFn]
  );

  const pushNumberPropsUpdate = React.useCallback(async () => {
    await pushNumberPropsStateUpdate(params.elementId);
  }, [params.elementId, pushNumberPropsStateUpdate]);

  const errors: NumberPropsFormErrors = React.useMemo(() => {
    return numberPropsStateErrors.get(params.elementId) ?? {};
  }, [numberPropsStateErrors, params.elementId]);

  return {
    numberPropsState: numberProps,
    updateNumberProps,
    pushNumberPropsUpdate,
    numberPropsErrors: errors,
  };
};
