import React from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNotifications } from "@toolpad/core/useNotifications";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { updateNumberElementDataSourceMutationDocument } from "../../glqDocuments/element/number.documents";
import { elementsByTemplateIdQueryDocument } from "../../glqDocuments/element/element.documents";
import { validateNumberDataSource } from "../element/number/numberValidators";
import { logger } from "@/client/lib/logger";
import { useAppTranslation } from "@/client/locale";
import {
  SanitizedNumberDataSourceFormState,
  DataSourceFormErrors,
  UpdateNumberDataSourceWithElementIdFn,
  numberDataSourceToInput,
} from "../element/number/types";

export type UseNumberDataSourceStateParams = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
};

export type UseNumberDataSourceStateReturn = {
  getState: (elementId: number) => SanitizedNumberDataSourceFormState | null;
  updateFn: UpdateNumberDataSourceWithElementIdFn;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, DataSourceFormErrors>;
};

/**
 * Type guard to check if element is NumberElement
 */
function isNumberElement(
  element: GQL.CertificateElementUnion
): element is GQL.NumberElement {
  return element.__typename === "NumberElement";
}

/**
 * Extract numberDataSource state from element
 */
function extractNumberDataSourceState(
  element: GQL.CertificateElementUnion
): SanitizedNumberDataSourceFormState | null {
  if (isNumberElement(element) && element.numberDataSource) {
    return numberDataSourceToInput(element.numberDataSource);
  }
  return null;
}

/**
 * Convert numberDataSource input to update input
 */
function toUpdateInput(
  elementId: number,
  state: SanitizedNumberDataSourceFormState
): GQL.NumberElementDataSourceStandaloneUpdateInput {
  return {
    elementId: elementId,
    dataSource: state,
  };
}

export function useNumberDataSourceState(
  params: UseNumberDataSourceStateParams
): UseNumberDataSourceStateReturn {
  const { templateId, elements: providedElements } = params;
  const notifications = useNotifications();
  const { errorTranslations: errorStrings } = useAppTranslation();

  const [updateNumberElementDataSourceMutation] = useMutation(
    updateNumberElementDataSourceMutationDocument
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
    Map<number, SanitizedNumberDataSourceFormState>
  >(new Map());
  const [errorsMap, setErrorsMap] = React.useState<
    Map<number, DataSourceFormErrors>
  >(new Map());
  const errorsRef = React.useRef<Map<number, DataSourceFormErrors>>(
    new Map()
  );
  const pendingUpdatesRef = React.useRef<
    Map<number, SanitizedNumberDataSourceFormState>
  >(new Map());
  const debounceTimersRef = React.useRef<Map<number, NodeJS.Timeout>>(
    new Map()
  );

  // Get state, creating from element if missing
  const getState = React.useCallback(
    (elementId: number): SanitizedNumberDataSourceFormState | null => {
      // Return existing state if present
      if (statesRef.current.has(elementId)) {
        return statesRef.current.get(elementId)!;
      }

      // Find element and extract initial state
      const element = elements.find(el => el.base?.id === elementId);
      if (!element) {
        return null;
      }

      const initialState = extractNumberDataSourceState(element);
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
      state: SanitizedNumberDataSourceFormState
    ): Promise<void> => {
      try {
        const updateInput = toUpdateInput(elementId, state);
        await updateNumberElementDataSourceMutation({
          variables: {
            input: updateInput,
          },
        });
      } catch (error) {
        const errorMessage =
          errorStrings?.updateFailed || "Failed to update number data source";
        logger.error("useNumberDataSourceState: Mutation failed", {
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
    [updateNumberElementDataSourceMutation, notifications, errorStrings]
  );

  // Update function - replaces entire dataSource
  const updateFn = React.useCallback<UpdateNumberDataSourceWithElementIdFn>(
    (elementId: number, dataSource: GQL.NumberDataSourceInput) => {
      // Validate entire dataSource
      const validationErrors = validateNumberDataSource(dataSource);

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
            logger.error("useNumberDataSourceState: Mutation failed", {
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
          logger.error("useNumberDataSourceState: Failed to save on unmount", {
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

