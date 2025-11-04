import React from "react";
import { useMutation } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateDateElementDataSourceMutationDocument } from "../../glqDocuments/element/date.documents";
import { validateDateDataSource } from "../element/date/dateValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  DateDataSourceFormState,
  DateDataSourceFormErrors,
  UpdateDateDataSourceWithElementIdFn,
  dateDataSourceToInput,
  DateDataSourceFieldErrors,
} from "../element/date/types";
import { useElementState } from "./useElementState";
import { useCertificateElementContext } from "../../CertificateElementContext";

export type UseDateDataSourceStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseDateDataSourceStateReturn = {
  dateDataSourceStates: Map<number, DateDataSourceFormState>;
  updateDateDataSourceStateFn: UpdateDateDataSourceWithElementIdFn;
  pushDateDataSourceStateUpdate: (elementId: number) => Promise<void>;
  initDateDataSourceState: (elementId: number) => DateDataSourceFormState;
  dateDataSourceStateErrors: Map<number, DateDataSourceFormErrors>;
};

/**
 * Type guard to check if element is DateElement
 */
function isDateElement(
  element: GQL.CertificateElementUnion
): element is GQL.DateElement {
  return element.__typename === "DateElement";
}

/**
 * Extract dateDataSource state from element
 */
function extractDateDataSourceState(
  element: GQL.CertificateElementUnion
): DateDataSourceFormState | null {
  if (isDateElement(element) && element.dateDataSource) {
    return {
      dataSource: dateDataSourceToInput(element.dateDataSource),
    };
  }
  return null;
}

/**
 * Convert dateDataSource input to update input
 */
function toUpdateInput(
  elementId: number,
  state: DateDataSourceFormState
): GQL.DateDataSourceStandaloneInput {
  return {
    elementId: elementId,
    dataSource: state.dataSource,
  };
}

export function useDateDataSourceState(
  params: UseDateDataSourceStateParams
): UseDateDataSourceStateReturn {
  const { templateId, elements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateDateElementDataSourceMutation] = useMutation(
    updateDateElementDataSourceMutationDocument
  );

  // Mutation function
  const mutationFn = React.useCallback(
    async (
      elementId: number,
      state: DateDataSourceFormState
    ): Promise<void> => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateDateElementDataSourceMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage =
          errorStrings?.updateFailed || "Failed to update date data source";
        logger.error("useDateDataSourceState: Mutation failed", {
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
    [updateDateElementDataSourceMutation, notifications, errorStrings]
  );

  const validator = validateDateDataSource();

  const { states, updateFn, pushUpdate, initState, errors } = useElementState<
    DateDataSourceFormState,
    DateDataSourceFormErrors,
    DateDataSourceFieldErrors
  >({
    templateId,
    elements,
    validator,
    extractInitialState: extractDateDataSourceState,
    mutationFn,
    stateNamespace: "dateDataSource",
  });

  return {
    dateDataSourceStates: states,
    updateDateDataSourceStateFn: updateFn,
    pushDateDataSourceStateUpdate: pushUpdate,
    initDateDataSourceState: initState,
    dateDataSourceStateErrors: errors,
  };
}

export type UseDateDataSourceParams = {
  elementId: number;
};

export const useDateDataSource = (params: UseDateDataSourceParams) => {
  const {
    dateDataSource: {
      dateDataSourceStates,
      updateDateDataSourceStateFn,
      pushDateDataSourceStateUpdate,
      initDateDataSourceState,
      dateDataSourceStateErrors,
    },
  } = useCertificateElementContext();

  // Get state or initialize if not present (only initialize once)
  const { dataSource } = React.useMemo(() => {
    return (
      dateDataSourceStates.get(params.elementId) ??
      initDateDataSourceState(params.elementId)
    );
  }, [dateDataSourceStates, params.elementId, initDateDataSourceState]);

  const updateDateDataSource = React.useCallback(
    (dataSource: GQL.DateDataSourceInput) => {
      updateDateDataSourceStateFn(params.elementId, {
        key: "dataSource",
        value: dataSource,
      });
    },
    [params.elementId, updateDateDataSourceStateFn]
  );

  const pushDateDataSourceUpdate = React.useCallback(async () => {
    await pushDateDataSourceStateUpdate(params.elementId);
  }, [params.elementId, pushDateDataSourceStateUpdate]);

  const { dataSource: errors } = React.useMemo(() => {
    return (
      dateDataSourceStateErrors.get(params.elementId) || {
        dataSource: {},
      }
    );
  }, [dateDataSourceStateErrors, params.elementId]);

  return {
    dateDataSourceState: dataSource,
    updateDateDataSource,
    pushDateDataSourceUpdate,
    dateDataSourceErrors: errors,
  };
};
