import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateNumberElementSpecPropsMutationDocument } from "../../glqDocuments/element/number.documents";
import { useElementState } from "./useElementState";
import { validateNumberElementSpecProps } from "../element/number/numberValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  SanitizedNumberPropsFormState,
  NumberPropsFormErrors,
  UpdateNumberPropsWithElementIdFn,
  ValidateNumberPropsFieldFn,
} from "../element/number";

export type UseNumberPropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseNumberPropsStateReturn = {
  getState: (elementId: number) => SanitizedNumberPropsFormState | null;
  updateFn: UpdateNumberPropsWithElementIdFn;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, NumberPropsFormErrors>;
};

/**
 * Extract numberProps state from NumberElement
 */
function extractNumberPropsState(
  element: GQL.CertificateElementUnion
): SanitizedNumberPropsFormState | null {
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
  state: SanitizedNumberPropsFormState
): GQL.NumberElementSpecPropsStandaloneUpdateInput {
  return {
    elementId: elementId,
    numberProps: {
      mapping: state.mapping,
    },
  };
}

export function useNumberPropsState(
  params: UseNumberPropsStateParams
): UseNumberPropsStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateNumberElementSpecPropsMutation] = useMutation(
    updateNumberElementSpecPropsMutationDocument
  );

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: SanitizedNumberPropsFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateNumberElementSpecPropsMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage =
          errorStrings?.updateFailed || "Failed to update number properties";
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
  const validator: ValidateNumberPropsFieldFn = validateNumberElementSpecProps();

  const { getState, updateFn, pushUpdate, errors } = useElementState({
    templateId,
    elements,
    validator,
    extractInitialState: extractNumberPropsState,
    mutationFn,
  });

  return {
    getState,
    updateFn,
    pushUpdate,
    errors,
  };
}

