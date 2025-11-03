import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateElementCommonPropertiesMutationDocument } from "../../glqDocuments/element/element.documents";
import { useElementState } from "./useElementState";
import { validateBaseElementField } from "../element/base/cretElementBaseValidator";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  BaseElementFormErrors,
  SanitizedBaseElementFormState,
  UpdateBaseElementWithElementIdFn,
  ValidateBaseElementFieldFn,
} from "../element/base";
import { Action } from "../types";
import { useCertificateElementContext } from "../../CertificateElementContext";

export type UseBaseElementStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseBaseElementStateReturn = {
  baseElementStates: Map<number, SanitizedBaseElementFormState>;
  updateBaseElementStateFn: UpdateBaseElementWithElementIdFn;
  pushBaseElementStateUpdate: (elementId: number) => Promise<void>;
  initBaseElementState: (elementId: number) => SanitizedBaseElementFormState;
  baseElementStateErrors: Map<number, BaseElementFormErrors>;
};

/**
 * Extract base state from element
 */
function extractBaseState(
  element: GQL.CertificateElementUnion
): SanitizedBaseElementFormState | null {
  if (!element.base?.templateId) {
    return null;
  }

  return {
    alignment: element.base.alignment,
    description: element.base.description ?? "",
    height: element.base.height,
    hidden: element.base.hidden ?? false,
    name: element.base.name,
    positionX: element.base.positionX,
    positionY: element.base.positionY,
    renderOrder: element.base.renderOrder,
    width: element.base.width,
  };
}

/**
 * Convert base input to update input
 */
function toUpdateInput(
  elementId: number,
  state: SanitizedBaseElementFormState
): GQL.CertificateElementBaseUpdateInput {
  return {
    id: elementId,
    alignment: state.alignment,
    description: state.description,
    height: state.height,
    hidden: state.hidden,
    name: state.name,
    positionX: state.positionX,
    positionY: state.positionY,
    renderOrder: state.renderOrder,
    width: state.width,
  };
}

export function useBaseElementState(
  params: UseBaseElementStateParams
): UseBaseElementStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateElementCommonPropertiesMutation] = useMutation(
    updateElementCommonPropertiesMutationDocument
  );

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: SanitizedBaseElementFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateElementCommonPropertiesMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage =
          errorStrings?.updateFailed || "Failed to update element";
        logger.error("useBaseElementState: Mutation failed", {
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
    [updateElementCommonPropertiesMutation, notifications, errorStrings]
  );

  // Use generic hook
  // Note: validateBaseElementField returns a validator for Omit<CertificateElementBaseInput, "hidden">
  // but we need one for CertificateElementBaseInput. We'll cast it for now.
  const baseValidator = validateBaseElementField();
  const validator: ValidateBaseElementFieldFn = action => {
    return baseValidator(action);
  };

  const { states, updateFn, pushUpdate, initState, errors } = useElementState({
    templateId,
    elements,
    validator,
    extractInitialState: extractBaseState,
    mutationFn,
    stateNamespace: "baseElement",
  });

  return {
    baseElementStates: states,
    updateBaseElementStateFn: updateFn,
    pushBaseElementStateUpdate: pushUpdate,
    initBaseElementState: initState,
    baseElementStateErrors: errors,
  };
}

export type UseBaseElementParams = {
  elementId: number;
};

export const useBaseElement = (params: UseBaseElementParams) => {
  const {
    bases: {
      baseElementStates,
      updateBaseElementStateFn,
      pushBaseElementStateUpdate,
      initBaseElementState,
      baseElementStateErrors,
    },
  } = useCertificateElementContext();

  // Get state or initialize if not present (only initialize once)
  const baseElementState = React.useMemo(() => {
    return (
      baseElementStates.get(params.elementId) ??
      initBaseElementState(params.elementId)
    );
  }, [baseElementStates, params.elementId, initBaseElementState]);

  const pushBaseElementUpdate = React.useCallback(async () => {
    await pushBaseElementStateUpdate(params.elementId);
  }, [params.elementId, pushBaseElementStateUpdate]);

  const updateBaseElementState = React.useCallback(
    (action: Action<SanitizedBaseElementFormState>) => {
      updateBaseElementStateFn(params.elementId, action);
    },
    [params.elementId, updateBaseElementStateFn]
  );

  const baseElementErrors = baseElementStateErrors.get(params.elementId) || {};

  return {
    baseElementState,
    updateBaseElementState,
    pushBaseElementUpdate,
    baseElementErrors,
  };
};
