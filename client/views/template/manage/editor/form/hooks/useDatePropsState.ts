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
  DatePropsFormState,
  DatePropsFormErrors,
  UpdateDatePropsWithElementIdFn,
  UpdateDatePropsFn,
} from "../element/date";
import { useCertificateElementStates } from "../../CertificateElementContext";

export type UseDatePropsStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseDatePropsStateReturn = {
  datePropsStates: Map<number, DatePropsFormState>;
  updateDatePropsStateFn: UpdateDatePropsWithElementIdFn;
  pushDatePropsStateUpdate: (elementId: number) => Promise<void>;
  initDatePropsState: (elementId: number) => DatePropsFormState;
  datePropsStateErrors: Map<number, DatePropsFormErrors>;
};

/**
 * Extract dateProps state from DateElement
 */
function extractDatePropsState(
  element: GQL.CertificateElementUnion
): DatePropsFormState | null {
  if (element.__typename !== "DateElement" || !element.dateProps) {
    return null;
  }

  return {
    calendarType:
      (element.dateProps.calendarType as GQL.CalendarType) ?? undefined,
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
  state: DatePropsFormState
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
    async (elementId: number, state: DatePropsFormState) => {
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
  const validator = validateDateProps();

  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    DatePropsFormState,
    DatePropsFormErrors,
    string | undefined
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractDatePropsState,
    mutationFn,
    stateNamespace: "dateProps",
  });

  return {
    datePropsStates: states,
    updateDatePropsStateFn: updateFn,
    pushDatePropsStateUpdate: pushUpdate,
    initDatePropsState: initState,
    datePropsStateErrors: errors,
  };
}

export type UseDatePropsParams = {
  elementId: number;
};

export const useDateProps = (params: UseDatePropsParams) => {
  const {
    dateProps: {
      datePropsStates,
      updateDatePropsStateFn,
      pushDatePropsStateUpdate,
      initDatePropsState,
      datePropsStateErrors,
    },
  } = useCertificateElementStates();

  // Get state or initialize if not present (only initialize once)
  const dateProps: DatePropsFormState = React.useMemo(() => {
    return (
      datePropsStates.get(params.elementId) ??
      initDatePropsState(params.elementId)
    );
  }, [datePropsStates, params.elementId, initDatePropsState]);

  const updateDateProps: UpdateDatePropsFn = React.useCallback(
    action => {
      updateDatePropsStateFn(params.elementId, action);
    },
    [params.elementId, updateDatePropsStateFn]
  );

  const pushDatePropsUpdate = React.useCallback(async () => {
    await pushDatePropsStateUpdate(params.elementId);
  }, [params.elementId, pushDatePropsStateUpdate]);

  const errors: DatePropsFormErrors = React.useMemo(() => {
    return datePropsStateErrors.get(params.elementId) || {};
  }, [datePropsStateErrors, params.elementId]);

  return {
    datePropsState: dateProps,
    updateDateProps,
    pushDatePropsUpdate,
    datePropsErrors: errors,
  };
};
