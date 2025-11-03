import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateDateElementSpecPropsMutationDocument } from "../../glqDocuments/element";
import { useElementState } from "./useElementState";
import { validateDateProps } from "../element/date/dateValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  SanitizedDatePropsFormState,
  DatePropsFormErrors,
  UpdateDatePropsWithElementIdFn,
  ValidateDatePropsFieldFn,
} from "../element/date";

export type UseDatePropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseDatePropsStateReturn = {
  getState: (elementId: number) => SanitizedDatePropsFormState | null;
  updateFn: UpdateDatePropsWithElementIdFn;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, DatePropsFormErrors>;
};

/**
 * Extract dateProps state from DateElement
 */
function extractDatePropsState(
  element: GQL.CertificateElementUnion
): SanitizedDatePropsFormState | null {
  if (element.__typename !== "DateElement" || !element.dateProps) {
    return null;
  }

  return {
    calendarType: element.dateProps.calendarType as GQL.CalendarType ?? undefined,
    format: element.dateProps.format ?? "",
    offsetDays: element.dateProps.offsetDays ?? 0,
    transformation: element.dateProps.transformation ?? undefined,
  };
}

/**
 * Convert dateProps input to update input
 */
function toUpdateInput(
  elementId: number,
  state: SanitizedDatePropsFormState
): GQL.DateElementSpecPropsStandaloneInput {
  return {
    elementId: elementId,
    dateProps: {
      calendarType: state.calendarType,
      format: state.format,
      offsetDays: state.offsetDays,
      transformation: state.transformation,
    },
  };
}

export function useDatePropsState(
  params: UseDatePropsStateParams
): UseDatePropsStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateDateElementSpecPropsMutation] = useMutation(
    updateDateElementSpecPropsMutationDocument
  );

  // Mutation function
  const mutationFn = React.useCallback(
    async (elementId: number, state: SanitizedDatePropsFormState) => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateDateElementSpecPropsMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage =
          errorStrings?.updateFailed || "Failed to update date properties";
        logger.error("useDatePropsState: Mutation failed", {
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
    [updateDateElementSpecPropsMutation, notifications, errorStrings]
  );

  // Use generic hook
  const validator: ValidateDatePropsFieldFn = validateDateProps();

  const { getState, updateFn, pushUpdate, errors } = useElementState({
    templateId,
    elements,
    validator,
    extractInitialState: extractDatePropsState,
    mutationFn,
    stateNamespace: "dateProps",
  });

  return {
    getState,
    updateFn,
    pushUpdate,
    errors,
  };
}

