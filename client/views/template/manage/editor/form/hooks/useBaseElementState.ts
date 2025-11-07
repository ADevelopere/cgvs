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
  BaseCertificateElementFormState,
  UpdateBaseElementWithElementIdFn,
  ValidateBaseElementFieldFn,
  UpdateBaseElementFn,
} from "../element/base";
import { useCertificateElementStates } from "../../CertificateElementContext";
import { useNode } from "../../NodesStateProvider";

export type UseBaseElementStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseBaseElementStateReturn = {
  baseElementStates: Map<number, BaseCertificateElementFormState>;
  updateBaseElementStateFn: UpdateBaseElementWithElementIdFn;
  pushBaseElementStateUpdate: (elementId: number) => Promise<void>;
  initBaseElementState: (elementId: number) => BaseCertificateElementFormState;
  baseElementStateErrors: Map<number, BaseElementFormErrors>;
};

/**
 * Extract base state from element
 */
export function extractBaseStateInputFromElement(
  element: GQL.CertificateElementUnion
): BaseCertificateElementFormState {
  return {
    name: element.base.name,
    description: element.base.description,
    alignment: element.base.alignment,
    width: element.base.width,
    height: element.base.height,
    positionX: element.base.positionX,
    positionY: element.base.positionY,
    hidden: element.base.hidden,
    zIndex: element.base.zIndex,
  };
}

/**
 * Convert base input to update input
 */
function toUpdateInput(
  elementId: number,
  state: BaseCertificateElementFormState
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
    width: state.width,
  };
}

export function useBaseElementState(params: UseBaseElementStateParams): UseBaseElementStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();
  const { updateBaseNodeData,showNode, hideNode } = useNode();

  const [updateElementCommonPropertiesMutation] = useMutation(updateElementCommonPropertiesMutationDocument);

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: BaseCertificateElementFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateElementCommonPropertiesMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage = errorStrings?.updateFailed || "Failed to update element";
        logger.error({ caller: "useBaseElementState" }, " Mutation failed", {
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

  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    BaseCertificateElementFormState,
    BaseElementFormErrors,
    string | undefined
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractBaseStateInputFromElement,
    mutationFn,
    stateNamespace: "baseElement",
  });

  // Enhanced update function that also updates the nodes store
  const updateBaseElementStateWithNodes: UpdateBaseElementWithElementIdFn = React.useCallback(
    (elementId, action) => {
      // Update the base state
      updateFn(elementId, action);

      // Update the nodes store
      const { key, value } = action;

      // Map form state keys to node data properties
      if (key === "positionX" || key === "positionY" || key === "width" || key === "height" || key === "zIndex") {
        updateBaseNodeData(elementId, {
          [key]: value,
        });
      }

      if (key === "hidden") {
        if (value) {
          hideNode(elementId);
        } else {
          showNode(elementId);
        }
      }
    },
    [updateFn, updateBaseNodeData, hideNode, showNode]
  );

  return {
    baseElementStates: states,
    updateBaseElementStateFn: updateBaseElementStateWithNodes,
    pushBaseElementStateUpdate: pushUpdate,
    initBaseElementState: initState,
    baseElementStateErrors: errors,
  };
}

export type UseBaseElementParams = {
  elementId: number;
};

export type BaseElementHookReturn = {
  baseElementState: BaseCertificateElementFormState;
  updateBaseElementState: UpdateBaseElementFn;
  pushBaseElementUpdate: () => Promise<void>;
  baseElementErrors: BaseElementFormErrors;
};

export type BaseElementHook = (params: UseBaseElementParams) => BaseElementHookReturn;

export const useBaseElement = (params: UseBaseElementParams): BaseElementHookReturn => {
  const {
    bases: {
      baseElementStates,
      updateBaseElementStateFn,
      pushBaseElementStateUpdate,
      initBaseElementState,
      baseElementStateErrors,
    },
  } = useCertificateElementStates();

  // Get state or initialize if not present (only initialize once)
  const baseElementState: BaseCertificateElementFormState = React.useMemo(() => {
    return baseElementStates.get(params.elementId) ?? initBaseElementState(params.elementId);
  }, [baseElementStates, params.elementId, initBaseElementState]);

  const pushBaseElementUpdate = React.useCallback(async () => {
    await pushBaseElementStateUpdate(params.elementId);
  }, [params.elementId, pushBaseElementStateUpdate]);

  const updateBaseElementState: UpdateBaseElementFn = React.useCallback(
    action => {
      updateBaseElementStateFn(params.elementId, action);
    },
    [params.elementId, updateBaseElementStateFn]
  );

  const baseElementErrors: BaseElementFormErrors = React.useMemo(() => {
    return baseElementStateErrors.get(params.elementId) || {};
  }, [baseElementStateErrors, params.elementId]);

  return {
    baseElementState,
    updateBaseElementState,
    pushBaseElementUpdate,
    baseElementErrors,
  };
};
