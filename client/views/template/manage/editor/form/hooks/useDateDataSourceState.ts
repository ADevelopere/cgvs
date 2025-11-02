import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateDateElementDataSourceMutationDocument } from "../../glqDocuments/element/date.documents";
import { elementsByTemplateIdQueryDocument } from "../../glqDocuments/element/element.documents";
import { validateDateDataSource } from "../element/date/dateValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  SanitizedDateDataSourceFormState,
  DateDataSourceFormErrors,
  UpdateDateDataSourceWithElementIdFn,
  dateDataSourceToInput,
} from "../element/date/types";

export type UseDateDataSourceStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseDateDataSourceStateReturn = {
  getState: (elementId: number) => SanitizedDateDataSourceFormState | null;
  updateFn: UpdateDateDataSourceWithElementIdFn;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, DateDataSourceFormErrors>;
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
): SanitizedDateDataSourceFormState | null {
  if (isDateElement(element) && element.dateDataSource) {
    return dateDataSourceToInput(element.dateDataSource);
  }
  return null;
}

/**
 * Convert dateDataSource input to update input
 */
function toUpdateInput(
  elementId: number,
  state: SanitizedDateDataSourceFormState
): GQL.DateDataSourceStandaloneInput {
  return {
    elementId: elementId,
    dataSource: state,
  };
}

export function useDateDataSourceState(
  params: UseDateDataSourceStateParams
): UseDateDataSourceStateReturn {
  const { templateId, elements: providedElements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateDateElementDataSourceMutation] = useMutation(
    updateDateElementDataSourceMutationDocument
  );

  // Query elements if templateId provided
  const { data: elementsData } = useQuery(elementsByTemplateIdQueryDocument, {
    variables: { templateId: templateId! },
    skip: !templateId || providedElements !== undefined,
    fetchPolicy: "cache-first",
  });

  // Get elements from either provided or queried
  const elements = React.useMemo(() => {
    if (providedElements) {
      return providedElements;
    }
    return elementsData?.elementsByTemplateId || [];
  }, [providedElements, elementsData?.elementsByTemplateId]);

  // State management
  const statesRef = React.useRef<
    Map<number, SanitizedDateDataSourceFormState>
  >(new Map());
  const [errorsMap, setErrorsMap] = React.useState<
    Map<number, DateDataSourceFormErrors>
  >(new Map());
  const errorsRef = React.useRef<Map<number, DateDataSourceFormErrors>>(
    new Map()
  );
  const pendingUpdatesRef = React.useRef<
    Map<number, SanitizedDateDataSourceFormState>
  >(new Map());
  const debounceTimersRef = React.useRef<Map<number, NodeJS.Timeout>>(
    new Map()
  );

  // Get state, creating from element if missing
  const getState = React.useCallback(
    (elementId: number): SanitizedDateDataSourceFormState | null => {
      // Return existing state if present
      if (statesRef.current.has(elementId)) {
        return statesRef.current.get(elementId)!;
      }

      // Find element and extract initial state
      const element = elements.find(el => el.base?.id === elementId);
      if (!element) {
        return null;
      }

      const initialState = extractDateDataSourceState(element);
      if (initialState === null) {
        return null;
      }

      // Store and return
      statesRef.current.set(elementId, initialState);
      return initialState;
    },
    [elements]
  );

  // Mutation function
  const mutationFn = React.useCallback(
    async (
      elementId: number,
      state: SanitizedDateDataSourceFormState
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

  // Update function - replaces entire dataSource
  const updateFn = React.useCallback<UpdateDateDataSourceWithElementIdFn>(
    (elementId: number, dataSource: GQL.DateDataSourceInput) => {
      // Validate entire dataSource
      const validationErrors = validateDateDataSource(dataSource);

      // Update errors
      errorsRef.current.set(elementId, validationErrors);
      setErrorsMap(new Map(errorsRef.current));

      // Update state - replace entire dataSource
      statesRef.current.set(elementId, dataSource);

      // Store pending update
      pendingUpdatesRef.current.set(elementId, dataSource);

      // Clear existing debounce timer for this element
      const existingTimer = debounceTimersRef.current.get(elementId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new debounce timer
      const timer = setTimeout(() => {
        debounceTimersRef.current.delete(elementId);
        const pendingState = pendingUpdatesRef.current.get(elementId);
        if (pendingState) {
          mutationFn(elementId, pendingState).catch(error => {
            logger.error("useDateDataSourceState: Mutation failed", {
              elementId,
              error,
            });
          });
          pendingUpdatesRef.current.delete(elementId);
        }
      }, 10000); // 10 seconds

      debounceTimersRef.current.set(elementId, timer);
    },
    [mutationFn]
  );

  // Push update immediately
  const pushUpdate = React.useCallback(
    async (elementId: number): Promise<void> => {
      // Clear debounce timer
      const timer = debounceTimersRef.current.get(elementId);
      if (timer) {
        clearTimeout(timer);
        debounceTimersRef.current.delete(elementId);
      }

      // Get pending state
      const pendingState = pendingUpdatesRef.current.get(elementId);
      if (pendingState) {
        await mutationFn(elementId, pendingState);
        pendingUpdatesRef.current.delete(elementId);
      }
    },
    [mutationFn]
  );

  // Cleanup: save pending updates on unmount
  React.useEffect(() => {
    // Capture the current ref value when effect runs
    const timers = debounceTimersRef.current;
    const pendingUpdates = pendingUpdatesRef.current;
    return () => {
      // Clear all timers
      timers.forEach(timer => clearTimeout(timer));

      // Save all pending updates
      pendingUpdates.forEach((state, elementId) => {
        mutationFn(elementId, state).catch(error => {
          logger.error("useDateDataSourceState: Failed to save on unmount", {
            elementId,
            error,
          });
        });
      });
      timers.clear();
    };
  }, [mutationFn]);

  return {
    getState,
    updateFn,
    pushUpdate,
    errors: errorsMap,
  };
}

