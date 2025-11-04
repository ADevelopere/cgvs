import React from "react";
import { useQuery } from "@apollo/client/react";
import * as GQL from "@/client/graphql/generated/gql/graphql";
import { elementsByTemplateIdQueryDocument } from "../../glqDocuments/element/element.documents";
import { Action, ValidateFieldFn } from "../types";
import logger from "@/client/lib/logger";
// Persistent state cache at module level - survives remounts
// Key format: "templateId:namespace:elementId"
const persistentStateCache = new Map<string, unknown>();
 
const updateDebounceDelayMs = 10000; // 10 seconds

export type UseElementStateParams<T, VR> = {
  templateId?: number;
  elements?: GQL.CertificateElementUnion[];
  validator: ValidateFieldFn<T, VR>;
  extractInitialState: (element: GQL.CertificateElementUnion) => T | null;
  mutationFn: (elementId: number, state: T) => Promise<void>;
  stateNamespace: string; // e.g., "textProps", "baseElement", "dateProps"
};

export type UseElementStateReturn<T, E> = {
  states: Map<number, T>;
  updateFn: (elementId: number, action: Action<T>) => void;
  pushUpdate: (elementId: number) => Promise<void>;
  initState: (elementId: number) => T;
  errors: Map<number, E>;
  resetStateFromElements: (elementId: number) => void;
  getState: (elementId: number) => T | undefined;
};

/**
 * T: state type
 * E: error type
 * VR: validation result type
 */
export function useElementState<T, E, VR>(
  params: UseElementStateParams<T, VR>
): UseElementStateReturn<T, E> {
  const {
    templateId,
    elements: providedElements,
    validator,
    extractInitialState,
    mutationFn,
    stateNamespace,
  } = params;

  // Helper to generate cache key
  const getCacheKey = React.useCallback(
    (elementId: number) =>
      `${templateId ?? "noTpl"}:${stateNamespace}:${elementId}`,
    [templateId, stateNamespace]
  );

  // Helper to get from persistent cache
  const getFromPersistentCache = React.useCallback(
    (elementId: number): T | undefined => {
      const key = getCacheKey(elementId);
      return persistentStateCache.get(key) as T | undefined;
    },
    [getCacheKey]
  );

  // Helper to set in persistent cache
  const setInPersistentCache = React.useCallback(
    (elementId: number, state: T) => {
      const key = getCacheKey(elementId);
      persistentStateCache.set(key, state);
    },
    [getCacheKey]
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

  // State management - check persistent cache first
  const statesRef = React.useRef<Map<number, T>>(new Map());
  const [statesMap, setStatesMap] = React.useState<Map<number, T>>(() => {
    const initialStates = new Map<number, T>();
    const initialElements =
      providedElements || elementsData?.elementsByTemplateId || [];
    for (const element of initialElements) {
      if (element.base?.id) {
        const elementId = element.base.id;
        // Check persistent cache first
        const cachedState = getFromPersistentCache(elementId);
        if (cachedState) {
          initialStates.set(elementId, cachedState);
        } else {
          // Only extract if not in cache
          const initialState = extractInitialState(element);
          if (initialState) {
            initialStates.set(elementId, initialState);
            setInPersistentCache(elementId, initialState);
          }
        }
      }
    }
    statesRef.current = initialStates;
    return initialStates;
  });
  const [errorsMap, setErrorsMap] = React.useState<Map<number, E>>(
    new Map()
  );
  const errorsRef = React.useRef<Map<number, E>>(new Map());
  const pendingUpdatesRef = React.useRef<Map<number, T>>(new Map());
  const debounceTimersRef = React.useRef<Map<number, NodeJS.Timeout>>(
    new Map()
  );

  // Refs for dependencies to stabilize callbacks
  const elementsRef = React.useRef(elements);
  elementsRef.current = elements;
  const extractInitialStateRef = React.useRef(extractInitialState);
  extractInitialStateRef.current = extractInitialState;
  const validatorRef = React.useRef(validator);
  validatorRef.current = validator;
  const mutationFnRef = React.useRef(mutationFn);
  mutationFnRef.current = mutationFn;

  // Initialize state for an element - check persistent cache first
  const initState = React.useCallback(
    (elementId: number): T => {
      // Return existing state if already present in ref
      if (statesRef.current.has(elementId)) {
        const state = statesRef.current.get(elementId);
        if (state === undefined) {
          throw new Error(
            `useElementState: State is undefined for element id ${elementId}`
          );
        }
        return state;
      }

      // Check persistent cache
      const cachedState = getFromPersistentCache(elementId);
      if (cachedState) {
        statesRef.current.set(elementId, cachedState);
        // Schedule a state update instead of calling it directly
        Promise.resolve().then(() => setStatesMap(new Map(statesRef.current)));
        return cachedState;
      }

      // Find element and extract initial state (only if not in cache)
      const element = elementsRef.current.find(el => el.base?.id === elementId);
      if (!element) {
        throw new Error(
          `useElementState: Element not found for id ${elementId}`
        );
      }

      const initialState = extractInitialStateRef.current(element);
      if (initialState === undefined || initialState === null) {
        throw new Error(
          `useElementState: Failed to extract initial state for element id ${elementId}`
        );
      }

      // Store in both ref and persistent cache
      statesRef.current.set(elementId, initialState);
      setInPersistentCache(elementId, initialState);
      // Schedule a state update instead of calling it directly
      Promise.resolve().then(() => setStatesMap(new Map(statesRef.current)));

      return initialState;
    },
    [getFromPersistentCache, setInPersistentCache]
  );

  // Get state, creating from element if missing
  const getState = React.useCallback(
    (elementId: number): T | undefined => {
      // Return existing state if present
      if (statesRef.current.has(elementId)) {
        return statesRef.current.get(elementId);
      }

      // Check persistent cache
      const cachedState = getFromPersistentCache(elementId);
      if (cachedState) {
        return cachedState;
      }

      return undefined;
    },
    [getFromPersistentCache]
  );

  // Reset state from server data (elements list)
  const resetStateFromElements = React.useCallback(
    (elementId: number) => {
      const element = elementsRef.current.find(el => el.base?.id === elementId);
      if (!element) {
        logger.warn(
          `useElementState: Cannot reset - element not found for id ${elementId}`
        );
        return;
      }

      const freshState = extractInitialStateRef.current(element);
      if (freshState === undefined || freshState === null) {
        logger.warn(
          `useElementState: Cannot reset - failed to extract state for element id ${elementId}`
        );
        return;
      }

      // Update all caches with fresh server state
      statesRef.current.set(elementId, freshState);
      setInPersistentCache(elementId, freshState);
      setStatesMap(new Map(statesRef.current));
    },
    [setInPersistentCache]
  );

  // Helper to safely get state for update operations
  const getStateForUpdate = React.useCallback(
    (elementId: number): T => {
      const state = getState(elementId);
      if (state === undefined) {
        // Initialize if missing
        return initState(elementId);
      }
      return state;
    },
    [getState, initState]
  );

  // Update function
  const updateFn = React.useCallback(
    (elementId: number, action: Action<T>) => {
      const { key, value } = action;

      // Get current state
      const currentState = getStateForUpdate(elementId);

      // Validate
      const error = validatorRef.current(action);

      // Update errors
      const currentErrors =
        (errorsRef.current.get(elementId) as Partial<E>) ?? {};
      const newErrors = {
        ...currentErrors,
        [key]: error,
      } as E

      errorsRef.current.set(elementId, newErrors);
      setErrorsMap(new Map(errorsRef.current));

      // Update state
      const newState = {
        ...currentState,
        [key]: value,
      };
      statesRef.current.set(elementId, newState);
      setInPersistentCache(elementId, newState); // Persist immediately
      setStatesMap(new Map(statesRef.current));

      // Store pending update
      pendingUpdatesRef.current.set(elementId, newState);

      // Clear existing debounce timer for this element
      const existingTimer = debounceTimersRef.current.get(elementId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Set new debounce timer
      const timer = setTimeout(() => {
        if (error) return;
        debounceTimersRef.current.delete(elementId);
        const pendingState = pendingUpdatesRef.current.get(elementId);
        if (pendingState) {
          mutationFnRef.current(elementId, pendingState).catch(error => {
            logger.error(
              "useElementState: Mutation failed, resetting to server state",
              {
                elementId,
                error,
              }
            );
            // Reset to server state on failure
            resetStateFromElements(elementId);
          });
          pendingUpdatesRef.current.delete(elementId);
        }
      }, updateDebounceDelayMs);

      debounceTimersRef.current.set(elementId, timer);
    },
    [getStateForUpdate, setInPersistentCache, resetStateFromElements]
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
        try {
          await mutationFnRef.current(elementId, pendingState);
          pendingUpdatesRef.current.delete(elementId);
        } catch (error) {
          logger.error(
            "useElementState: Push update failed, resetting to server state",
            {
              elementId,
              error,
            }
          );
          // Reset to server state on failure
          resetStateFromElements(elementId);
          pendingUpdatesRef.current.delete(elementId);
          throw error;
        }
      }
    },
    [resetStateFromElements]
  );

  // Cleanup: save pending updates on unmount
  React.useEffect(() => {
    // Capture the current ref value when effect runs
    const timers = debounceTimersRef.current;
    const pendingUpdates = pendingUpdatesRef.current;
    const mutationFnOnUnmount = mutationFnRef.current;
    const resetFn = resetStateFromElements;
    return () => {
      // Clear all timers
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }

      // Save all pending updates
      for (const [elementId, state] of pendingUpdates.entries()) {
        mutationFnOnUnmount(elementId, state).catch(error => {
          logger.error(
            "useElementState: Failed to save on unmount, resetting to server state",
            {
              elementId,
              error,
            }
          );
          // Reset to server state on failure
          resetFn(elementId);
        });
      }
      timers.clear();
    };
  }, [resetStateFromElements]);

  return {
    states: statesMap,
    updateFn,
    pushUpdate,
    initState,
    errors: errorsMap,
    resetStateFromElements,
    getState,
  };
}
