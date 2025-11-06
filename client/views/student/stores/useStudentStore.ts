import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FilterClause } from "@/client/types/filters";
import logger from "@/client/lib/logger";

/**
 * Student UI Store State
 * Manages query variables and UI state for student management
 */
type State = {
  selectedStudents: number[];
  queryParams: Graphql.StudentsQueryVariables;
  filters: Record<string, FilterClause | null>; // UI filter state
};

type Actions = {
  setQueryParams: (params: Partial<Graphql.StudentsQueryVariables>) => void;
  toggleStudentSelect: (id: number) => void;
  selectAllStudents: (studentIds: number[]) => void;
  clearSelectedStudents: () => void;
  setFilters: (filters: Record<string, FilterClause | null>) => void;
  setColumnFilter: (clause: FilterClause | null, columnId: string) => void;
  clearFilter: (columnId: string) => void;
  clearAllFilters: () => void;
  reset: () => void;
};

type StudentStoreState = State & Actions;

const DEFAULT_QUERY_PARAMS: Graphql.StudentsQueryVariables = {
  paginationArgs: {
    first: 100,
    page: 1,
  },
  orderBy: [
    {
      column: Graphql.StudentsOrderByColumn.Name,
      order: Graphql.OrderSortDirection.Asc,
    },
  ],
};

const initialState: State = {
  selectedStudents: [],
  queryParams: DEFAULT_QUERY_PARAMS,
  filters: {},
};

/**
 * Zustand store for student UI state
 * Persists query parameters to sessionStorage for restoration
 */
export const useStudentStore = create<StudentStoreState>()(
  persist(
    set => ({
      ...initialState,

      setQueryParams: params =>
        set(state => {
          logger.info({ caller: "useStudentStore" }, "🔍 useStudentStore: setQueryParams called with:", params);
          logger.info({ caller: "useStudentStore" }, "🔍 current queryParams before:", state.queryParams);

          const newQueryParams = {
            ...state.queryParams,
            ...params,
          };

          logger.info({ caller: "useStudentStore" }, "🔍 new queryParams after setQueryParams:", newQueryParams);
          return { queryParams: newQueryParams };
        }),

      toggleStudentSelect: id =>
        set(state => {
          const isSelected = state.selectedStudents.includes(id);
          if (isSelected) {
            // Remove from selection
            return {
              selectedStudents: state.selectedStudents.filter(studentId => studentId !== id),
            };
          } else {
            // Clear previous selection and select this student (single select)
            return {
              selectedStudents: [id],
            };
          }
        }),

      selectAllStudents: studentIds => set({ selectedStudents: studentIds }),

      clearSelectedStudents: () => set({ selectedStudents: [] }),

      setFilters: filters => set({ filters }),

      setColumnFilter: (clause, columnId) =>
        set(state => {
          logger.info({ caller: "useStudentStore" }, "🔍 setColumnFilter called with:", {
            clause,
            columnId,
          });
          logger.info({ caller: "useStudentStore" }, "🔍 current filters before:", state.filters);
          logger.info(
            { caller: "useStudentStore" },
            "🔍 current queryParams.filterArgs before:",
            state.queryParams.filterArgs
          );

          const newFilters = { ...state.filters };
          if (clause) {
            newFilters[columnId] = clause;
            logger.info({ caller: "useStudentStore" }, "🔍 setting filter for column:", columnId);
          } else {
            delete newFilters[columnId];
            logger.info({ caller: "useStudentStore" }, "🔍 removing filter for column:", columnId);
          }

          logger.info({ caller: "useStudentStore" }, "🔍 new filters after setColumnFilter:", newFilters);
          return { filters: newFilters };
        }),

      clearFilter: columnId =>
        set(state => {
          logger.info({ caller: "useStudentStore" }, "🔍 clearFilter called with columnId:", columnId);
          logger.info({ caller: "useStudentStore" }, "🔍 current filters before:", state.filters);
          logger.info(
            { caller: "useStudentStore" },
            "🔍 current queryParams.filterArgs before:",
            state.queryParams.filterArgs
          );

          const newFilters = { ...state.filters };
          delete newFilters[columnId];

          logger.info({ caller: "useStudentStore" }, "🔍 new filters after clearFilter:", newFilters);
          return { filters: newFilters };
        }),

      clearAllFilters: () => set({ filters: {} }),

      reset: () => set(initialState),
    }),
    {
      name: "student-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist query parameters for restoration
      partialize: state => {
        logger.info(
          { caller: "useStudentStore" },
          "💾 Persisting student store state:",
          JSON.stringify(state, null, 2)
        );
        const persistedState = {
          queryParams: state.queryParams,
          filters: state.filters,
          selectedStudents: state.selectedStudents,
        };
        return persistedState;
      },
      // Custom merge to handle state restoration
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<State>;

        logger.info(
          { caller: "useStudentStore" },
          "🔄 Merging student store state:",
          JSON.stringify(persistedState, null, 2),
          JSON.stringify(currentState, null, 2)
        );

        // Deep merge the queryParams to preserve nested objects
        const mergedQueryParams = typedPersistedState?.queryParams
          ? {
              ...currentState.queryParams,
              ...typedPersistedState.queryParams,
              // Deep merge paginationArgs
              paginationArgs: {
                ...currentState.queryParams.paginationArgs,
                ...typedPersistedState.queryParams.paginationArgs,
              },
              // Preserve orderBy from persisted state
              orderBy: typedPersistedState.queryParams.orderBy || currentState.queryParams.orderBy,
              // Preserve filterArgs from persisted state
              filterArgs: typedPersistedState.queryParams.filterArgs || currentState.queryParams.filterArgs,
            }
          : currentState.queryParams;

        const mergedState = {
          ...currentState,
          queryParams: mergedQueryParams,
          filters: typedPersistedState?.filters || currentState.filters,
          selectedStudents: typedPersistedState?.selectedStudents || currentState.selectedStudents,
        };

        logger.info({ caller: "useStudentStore" }, "✅ Final merged state:", JSON.stringify(mergedState, null, 2));
        return mergedState;
      },
    }
  )
);
