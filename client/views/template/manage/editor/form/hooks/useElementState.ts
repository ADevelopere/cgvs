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
  extractInitialState: (element: GQL.CertificateElementUnion) => T | null;
  mutationFn: (elementId: number, state: T) => Promise<void>;
};

export type UseElementStateReturn<T> = {
  getState: (elementId: number) => T;
  updateFn: (elementId: number, action: Action<T>) => void;
  pushUpdate: (elementId: number) => Promise<void>;
  errors: Map<number, FormErrors<T>>;
};

export function useElementState<T>(
  params: UseElementStateParams<T>
): UseElementStateReturn<T> {
  const {
    templateId,
    elements: providedElements,
    validator,
    extractInitialState,
    mutationFn,
  } = params;

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
  const statesRef = React.useRef<Map<number, T>>(new Map());
  const [errorsMap, setErrorsMap] = React.useState<Map<number, FormErrors<T>>>(
    new Map()
  );
  const errorsRef = React.useRef<Map<number, FormErrors<T>>>(new Map());
  const pendingUpdatesRef = React.useRef<Map<number, T>>(new Map());
  const debounceTimersRef = React.useRef<Map<number, NodeJS.Timeout>>(
    new Map()
  );

  // Get state, creating from element if missing
  const getState = React.useCallback(
    (elementId: number): T => {
      // Return existing state if present
      if (statesRef.current.has(elementId)) {
        const state = statesRef.current.get(elementId);
        if (state === undefined) {
          throw new Error(`useElementState: State is undefined for element id ${elementId}`);
        }
        return state;
      }

      // Find element and extract initial state
      const element = elements.find(el => el.base?.id === elementId);
      if (!element) {
        throw new Error(`useElementState: Element not found for id ${elementId}`);
      }

      const initialState = extractInitialState(element);
      if (initialState === undefined || initialState === null) {
        throw new Error(`useElementState: Failed to extract initial state for element id ${elementId}`);
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

      // Get current state (will throw if element not found)
      const currentState = getState(elementId);

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
          mutationFn(elementId, pendingState).catch(error => {
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
    // Capture the current ref value when effect runs
    const timers = debounceTimersRef.current;
    const pendingUpdates = pendingUpdatesRef.current;
    return () => {
      // Clear all timers
      // Cleanup uses the captured value, not the ref
      timers.forEach(timer => clearTimeout(timer));

      // Save all pending updates
      pendingUpdates.forEach((state, elementId) => {
        mutationFn(elementId, state).catch(error => {
          logger.error("useElementState: Failed to save on unmount", {
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
