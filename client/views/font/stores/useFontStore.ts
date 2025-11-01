import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import logger from "@/client/lib/logger";
import * as GQl from "@/client/graphql/generated/gql/graphql";

/**
 * Font UI Store State
 * Manages query parameters, selection, and UI state only
 * Data is managed by Apollo Client
 */
type State = {
  // Query parameters (using GraphQL generated types)
  queryParams: GQl.FontsQueryVariables;

  // Selection - store the actual font object
  selectedFont: GQl.Font | null;

  // UI state
  isCreating: boolean;
  isEditing: boolean;
};

type Actions = {
  // Query params actions
  setQueryParams: (params: Partial<GQl.FontsQueryVariables>) => void;

  // Selection actions
  setSelectedFont: (font: GQl.Font | null) => void;

  // UI actions
  startCreating: () => void;
  cancelCreating: () => void;
  startEditing: () => void;
  cancelEditing: () => void;

  // Utility actions
  reset: () => void;
};

type FontStoreState = State & Actions;

const DEFAULT_QUERY_PARAMS: GQl.FontsQueryVariables = {
  paginationArgs: {
    first: 50,
    page: 1,
  },
  orderBy: [{ column: GQl.FontsOrderByColumn.Name, order: GQl.OrderSortDirection.Asc }],
  filterArgs: undefined,
};

const initialState: State = {
  queryParams: DEFAULT_QUERY_PARAMS,
  selectedFont: null,
  isCreating: false,
  isEditing: false,
};

/**
 * Zustand store for font UI state
 * Persists selection and query params to sessionStorage
 */
export const useFontStore = create<FontStoreState>()(
  persist(
    set => ({
      ...initialState,

      // Query params actions
      setQueryParams: params =>
        set(state => ({
          queryParams: { ...state.queryParams, ...params },
        })),

      // Selection actions
      setSelectedFont: font => {
        logger.info("Setting selected font:", font?.id);
        set({ selectedFont: font });
      },

      // UI actions
      startCreating: () => {
        logger.info("Starting font creation");
        set({
          isCreating: true,
          isEditing: false,
          selectedFont: null,
        });
      },

      cancelCreating: () => {
        logger.info("Canceling font creation");
        set({ isCreating: false });
      },

      startEditing: () => {
        logger.info("Starting font editing");
        set({ isEditing: true });
      },

      cancelEditing: () => {
        logger.info("Canceling font editing");
        set({ isEditing: false });
      },

      // Utility
      reset: () => {
        logger.info("Resetting font store");
        set(initialState);
      },
    }),
    {
      name: "font-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist only essential state (don't persist font object, only ID for restoration)
      partialize: state => ({
        selectedFontId: state.selectedFont?.id ?? null,
        queryParams: state.queryParams,
      }),
      // Custom merge to handle restoration
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<{
          selectedFontId: number | null;
          queryParams: GQl.FontsQueryVariables;
        }>;
        return {
          ...currentState,
          // Don't restore selectedFont from persistence - will be loaded from query
          selectedFont: null,
          queryParams: typedPersistedState.queryParams
            ? {
                ...currentState.queryParams,
                ...typedPersistedState.queryParams,
              }
            : currentState.queryParams,
        };
      },
    }
  )
);
