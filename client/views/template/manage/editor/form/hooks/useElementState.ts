import React from "react";
import { useQuery } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { elementsByTemplateIdQueryDocument } from "../../glqDocuments/element/element.documents";
import { Action, FormErrors, ValidateFieldFn } from "../types";
import { logger } from "@/client/lib/logger";

export type UseElementStateParams<T> = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
  validator: ValidateFieldFn<T>;
  extractInitialState: (
    element: GQL.CertificateElementUnion
  ) => T | null;
  mutationFn: (elementId: number, state: T) => Promise<void>;
};

export type UseElementStateReturn<T> = {
  getState: (elementId: number) => T | null;
  updateFn: (elementId: number, action: Action<T>) => void;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, FormErrors<T>>;
};

export function useElementState<T>(
  params: UseElementStateParams<T>
): UseElementStateReturn<T> {
  const { templateId, elements: providedElements, validator, extractInitialState, mutationFn } = params;

  // Query elements if templateId provided
  const {
    data: elementsData,
  } = useQuery(elementsByTemplateIdQueryDocument, {
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
  const statesRef = React.useRef<Map<number, T>>(new Map());
  const [errorsMap, setErrorsMap] = React.useState<Map<number, FormErrors<T>>>(
    new Map()
  );
  const errorsRef = React.useRef<Map<number, FormErrors<T>>>(new Map());
  const pendingUpdatesRef = React.useRef<Map<number, T>>(new Map());
  const debounceTimersRef = React.useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Get state, creating from element if missing
  const getState = React.useCallback(
    (elementId: number): T | null => {
      // Return existing state if present
      if (statesRef.current.has(elementId)) {
        return statesRef.current.get(elementId)!;
      }

      // Find element and extract initial state
      const element = elements.find(
        (el) => el.base?.id === elementId
      );
      if (!element) {
        return null;
      }

      const initialState = extractInitialState(element);
      if (initialState === null) {
        return null;
      }

      // Store and return
      statesRef.current.set(elementId, initialState);
      return initialState;
    },
    [elements, extractInitialState]
  );

  // Update function
  const updateFn = React.useCallback(
    (elementId: number, action: Action<T>) => {
      const { key, value } = action;

      // Get current state
      const currentState = getState(elementId);
      if (!currentState) {
        logger.warn("useElementState: Cannot update state for elementId", {
          elementId,
        });
        return;
      }

      // Validate
      const errorMessage = validator(action);

      // Update errors
      const currentErrors = errorsRef.current.get(elementId) || {};
      const newErrors = {
        ...currentErrors,
        [key]: errorMessage,
      };
      errorsRef.current.set(elementId, newErrors);
      setErrorsMap(new Map(errorsRef.current));

      // Update state
      const newState = {
        ...currentState,
        [key]: value,
      };
      statesRef.current.set(elementId, newState);

      // Store pending update
      pendingUpdatesRef.current.set(elementId, newState);

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
          mutationFn(elementId, pendingState).catch((error) => {
            logger.error("useElementState: Mutation failed", {
              elementId,
              error,
            });
          });
          pendingUpdatesRef.current.delete(elementId);
        }
      }, 10000); // 10 seconds

      debounceTimersRef.current.set(elementId, timer);
    },
    [getState, validator, mutationFn]
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
    return () => {
      // Clear all timers
      debounceTimersRef.current.forEach((timer) => {
        clearTimeout(timer);
      });
      debounceTimersRef.current.clear();

      // Save all pending updates
      pendingUpdatesRef.current.forEach((state, elementId) => {
        mutationFn(elementId, state).catch((error) => {
          logger.error("useElementState: Failed to save on unmount", {
            elementId,
            error,
          });
        });
      });
      pendingUpdatesRef.current.clear();
    };
  }, [mutationFn]);

  return {
    getState,
    updateFn,
    pushUpdate,
    errors: errorsMap,
  };
}

