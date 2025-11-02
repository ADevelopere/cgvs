import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateElementTextPropsMutationDocument } from "../../glqDocuments/element/element.documents";
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

export type UseTextPropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseTextPropsStateReturn = {
  getState: (
    elementId: number
  ) => SanitizedTextPropsFormState | null;
  updateFn: UpdateTextPropsWithElementIdFn;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, TextPropsFormErrors>;
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
function hasTextProps(
  element: GQL.CertificateElementUnion
): element is
  | GQL.TextElement
  | GQL.DateElement
  | GQL.NumberElement
  | GQL.CountryElement
  | GQL.GenderElement {
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

  const [updateElementTextPropsMutation] = useMutation(
    updateElementTextPropsMutationDocument
  );

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
        await updateElementTextPropsMutation({
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
    [updateElementTextPropsMutation, notifications, errorStrings]
  );

  // Use generic hook
  const validator: ValidateTextPropsFieldFn = validateTextPropsField();

  const { getState, updateFn, pushUpdate, errors } = useElementState({
    templateId,
    elements,
    validator,
    extractInitialState: extractTextPropsState,
    mutationFn,
  });

  return {
    getState,
    updateFn,
    pushUpdate,
    errors,
  };
}

