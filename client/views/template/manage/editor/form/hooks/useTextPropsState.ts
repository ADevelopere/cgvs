import React from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { useElementState } from "./useElementState";
import { validateTextPropsField } from "../element/textProps/textPropsValidator";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  SanitizedTextPropsFormState,
  TextPropsFormErrors,
  UpdateTextPropsWithElementIdFn,
  ValidateTextPropsFieldFn,
} from "../element/textProps";
import { Action } from "../types";
import { useTextPropsMutation } from "../../hooks";
import { TextPropsContext } from "@/client/contexts/TextPropsContext";

export type UseTextPropsStateParams = {
  elements?: GQL.CertificateElementUnion[];
  templateId?: number;
};

export type UseTextPropsStateReturn = {
  textPropsStates: Map<number, SanitizedTextPropsFormState>;
  updateTextPropsStateFn: UpdateTextPropsWithElementIdFn;
  pushTextPropsStateUpdate: (elementId: number) => Promise<void>;
  initTextPropsState: (elementId: number) => SanitizedTextPropsFormState;
  textPropsStateErrors: Map<number, TextPropsFormErrors>;
};

/**
 * Convert FontReference (output) to FontReferenceInput (input)
 */
function mapFontRefToFontRefInput(
  fontRef: GQL.FontReference
): GQL.FontReferenceInput {
  if (fontRef.__typename === "FontReferenceGoogle") {
    const googleRef = fontRef as GQL.FontReferenceGoogle;
    return {
      google: {
        identifier: googleRef.identifier ?? "",
      },
    };
  } else if (fontRef.__typename === "FontReferenceSelfHosted") {
    const selfHostedRef = fontRef as GQL.FontReferenceSelfHosted;
    return {
      selfHosted: {
        fontId: selfHostedRef.fontId ?? 0,
      },
    };
  } else {
    throw new Error("Invalid FontReference provided");
  }
}

/**
 * Type guard to check if element has textProps
 */
export function hasTextProps(
  element: GQL.CertificateElementUnion
): element is {textProps: GQL.TextProps, base: GQL.CertificateElementBase} {
  return (
    element.__typename === "TextElement" ||
    element.__typename === "DateElement" ||
    element.__typename === "NumberElement" ||
    element.__typename === "CountryElement" ||
    element.__typename === "GenderElement"
  );
}

/**
 * Extract textProps state from element
 */
function extractTextPropsState(
  element: GQL.CertificateElementUnion
): SanitizedTextPropsFormState | null {
  if (!hasTextProps(element) || !element.textProps) {
    return null;
  }

  return {
    color: element.textProps.color,
    fontSize: element.textProps.fontSize,
    overflow: element.textProps.overflow,
    fontRef: mapFontRefToFontRefInput(element.textProps.fontRef),
  };
}

/**
 * Convert textProps input to update input
 */
function toUpdateInput(
  textPropsId: number,
  state: SanitizedTextPropsFormState
): GQL.TextPropsUpdateInput {
  return {
    id: textPropsId,
    color: state.color,
    fontSize: state.fontSize,
    overflow: state.overflow,
    fontRef: state.fontRef,
  };
}

export function useTextPropsState(
  params: UseTextPropsStateParams
): UseTextPropsStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const { updateTextPropsMutation } = useTextPropsMutation(templateId ?? 0);

  // Get textPropsId from element - we need to track this per elementId
  // Store mapping of elementId -> textPropsId
  const textPropsIdMapRef = React.useRef<Map<number, number>>(new Map());

  // Build textPropsId map from elements
  React.useEffect(() => {
    const map = new Map<number, number>();
    elements?.forEach(element => {
      if (hasTextProps(element) && element.textProps?.id && element.base?.id) {
        map.set(element.base.id, element.textProps.id);
      }
    });
    textPropsIdMapRef.current = map;
  }, [elements]);

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: SanitizedTextPropsFormState) => {
      try {
        const textPropsId = textPropsIdMapRef.current.get(elementId);
        if (!textPropsId) {
          throw new Error(`No textPropsId found for elementId: ${elementId}`);
        }

        const updateInput = toUpdateInput(textPropsId, state);
        await updateTextPropsMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage =
          errorStrings?.updateFailed || "Failed to update text properties";
        logger.error("useTextPropsState: Mutation failed", {
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
    [updateTextPropsMutation, notifications, errorStrings]
  );

  // Use generic hook
  const validator: ValidateTextPropsFieldFn = validateTextPropsField();

  const { states, updateFn, pushUpdate, initState, errors } = useElementState({
    templateId,
    elements,
    validator,
    extractInitialState: extractTextPropsState,
    mutationFn,
    stateNamespace: "textProps",
  });

  return {
    textPropsStates: states,
    updateTextPropsStateFn: updateFn,
    pushTextPropsStateUpdate: pushUpdate,
    initTextPropsState: initState,
    textPropsStateErrors: errors,
  };
}

export type UseTextPropsParams = {
  elementId: number;
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export const useTextProps = (params: UseTextPropsParams) => {
  const {
    textPropsStates,
    updateTextPropsStateFn,
    pushTextPropsStateUpdate,
    initTextPropsState,
    textPropsStateErrors,
  } = useTextPropsState({
    templateId: params.templateId,
    elements: params.elements,
  });

  // Get state or initialize if not present (only initialize once)
  const textPropsState = React.useMemo(() => {
    return (
      textPropsStates.get(params.elementId) ??
      initTextPropsState(params.elementId)
    );
  }, [textPropsStates, params.elementId, initTextPropsState]);
  
  const updateTextProps = React.useCallback(
    (action: Action<GQL.TextPropsInput>) => {
      updateTextPropsStateFn(params.elementId, action);
    },
    [params.elementId, updateTextPropsStateFn]
  );

  logger.log(
    "useTextProps: textPropsState",
    JSON.stringify({
      elementId: params.elementId,
      textPropsState,
    })
  );

  const pushTextPropsUpdate = React.useCallback(async () => {
    await pushTextPropsStateUpdate(params.elementId);
  }, [params.elementId, pushTextPropsStateUpdate]);

  const textPropsErrors = textPropsStateErrors.get(params.elementId) || {};

  return {
    textPropsState,
    updateTextProps,
    pushTextPropsUpdate,
    textPropsErrors,
  };
};
