"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import logger from "@/client/lib/logger";

/**
 * Recipient Variable Data UI Store State
 * Manages query variables and UI state for recipient variable data management
 */
interface RecipientVariableDataState {
  // Selected group for managing recipient variable data
  selectedGroup: Graphql.TemplateRecipientGroup | null;

  // Persisted group ID (not exposed, used for persistence)
  selectedGroupId: number | null;

  // Query variables for recipient variable values
  queryParams: {
    recipientGroupId: number;
    limit: number;
    offset: number;
  };
}

interface RecipientVariableDataActions {
  setSelectedGroup: (group: Graphql.TemplateRecipientGroup | null) => void;
  setSelectedGroupId: (groupId: number | null) => void;
  setQueryParams: (params: Partial<RecipientVariableDataState["queryParams"]>) => void;
  setPagination: (limit: number, offset: number) => void;
  reset: () => void;
}

type RecipientVariableDataStoreState = RecipientVariableDataState & RecipientVariableDataActions;

// Persistence keys
const SELECTED_GROUP_ID_KEY = "recipient-variable-data-selected-group-id";
const QUERY_PARAMS_KEY = "recipient-variable-data-query-params";

// Helper functions for persistence
const getPersistedGroupId = (): number | null => {
  try {
    const stored = sessionStorage.getItem(SELECTED_GROUP_ID_KEY);
    return stored ? parseInt(stored, 10) : null;
  } catch {
    return null;
  }
};

const getPersistedQueryParams = (): RecipientVariableDataState["queryParams"] => {
  try {
    const stored = sessionStorage.getItem(QUERY_PARAMS_KEY);
    return stored
      ? JSON.parse(stored)
      : {
          recipientGroupId: 0,
          limit: 50,
          offset: 0,
        };
  } catch {
    return {
      recipientGroupId: 0,
      limit: 50,
      offset: 0,
    };
  }
};

const setPersistedGroupId = (groupId: number | null) => {
  if (groupId) {
    sessionStorage.setItem(SELECTED_GROUP_ID_KEY, groupId.toString());
  } else {
    sessionStorage.removeItem(SELECTED_GROUP_ID_KEY);
  }
};

const setPersistedQueryParams = (params: RecipientVariableDataState["queryParams"]) => {
  sessionStorage.setItem(QUERY_PARAMS_KEY, JSON.stringify(params));
};

const initialState: RecipientVariableDataState = {
  selectedGroup: null,
  selectedGroupId: getPersistedGroupId(),
  queryParams: getPersistedQueryParams(),
};

/**
 * Zustand store for recipient variable data UI state
 * Persists query parameters and group selection to sessionStorage for restoration
 */
export const useRecipientVariableDataStore = create<RecipientVariableDataStoreState>()(
  persist(
    set => ({
      ...initialState,

      setSelectedGroup: group =>
        set(state => {
          const groupId = group?.id || null;
          setPersistedGroupId(groupId);
          logger.info("🔍 useRecipientVariableDataStore: setSelectedGroup called with:", group);
          return {
            selectedGroup: group,
            selectedGroupId: groupId,
            queryParams: {
              ...state.queryParams,
              recipientGroupId: group?.id || 0,
              offset: 0, // Reset to first page when group changes
            },
          };
        }),

      setSelectedGroupId: groupId =>
        set(state => {
          setPersistedGroupId(groupId);
          logger.info("🔍 useRecipientVariableDataStore: setSelectedGroupId called with:", groupId);
          return {
            selectedGroupId: groupId,
            queryParams: {
              ...state.queryParams,
              recipientGroupId: groupId || 0,
              offset: 0, // Reset to first page when group changes
            },
          };
        }),

      setQueryParams: params =>
        set(state => {
          const newParams = {
            ...state.queryParams,
            ...params,
          };
          setPersistedQueryParams(newParams);
          logger.info("🔍 useRecipientVariableDataStore: setQueryParams called with:", params);
          logger.info("🔍 useRecipientVariableDataStore: new queryParams:", newParams);
          return { queryParams: newParams };
        }),

      setPagination: (limit, offset) =>
        set(state => {
          const newParams = {
            ...state.queryParams,
            limit,
            offset,
          };
          setPersistedQueryParams(newParams);
          logger.info("🔍 useRecipientVariableDataStore: setPagination called with:", { limit, offset });
          return { queryParams: newParams };
        }),

      reset: () => {
        setPersistedGroupId(null);
        setPersistedQueryParams(initialState.queryParams);
        logger.info("🔍 useRecipientVariableDataStore: reset called");
        set(initialState);
      },
    }),
    {
      name: "recipient-variable-data-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist query parameters and group selection for restoration
      partialize: state => {
        logger.info("💾 Persisting recipient variable data store state:", JSON.stringify(state, null, 2));
        return {
          selectedGroupId: state.selectedGroupId,
          queryParams: state.queryParams,
        };
      },
      // Custom merge to handle state restoration
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<RecipientVariableDataState>;

        logger.info(
          "🔄 Merging recipient variable data store state:",
          JSON.stringify(persistedState, null, 2),
          JSON.stringify(currentState, null, 2)
        );

        // Deep merge the queryParams to preserve nested objects
        const mergedQueryParams = typedPersistedState?.queryParams
          ? {
              ...currentState.queryParams,
              ...typedPersistedState.queryParams,
            }
          : currentState.queryParams;

        const mergedState = {
          ...currentState,
          selectedGroupId: typedPersistedState?.selectedGroupId || currentState.selectedGroupId,
          queryParams: mergedQueryParams,
        };

        logger.info("✅ Final merged state:", JSON.stringify(mergedState, null, 2));
        return mergedState;
      },
    }
  )
);
