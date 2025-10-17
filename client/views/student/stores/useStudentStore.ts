import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FilterClause } from "@/client/types/filters";

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
  orderBy: [{ column: "NAME", order: "ASC" }],
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
    (set) => ({
      ...initialState,

      setQueryParams: (params) =>
        set((state) => ({
          queryParams: {
            ...state.queryParams,
            ...params,
          },
        })),

      toggleStudentSelect: (id) =>
        set((state) => {
          const isSelected = state.selectedStudents.includes(id);
          if (isSelected) {
            // Remove from selection
            return {
              selectedStudents: state.selectedStudents.filter(
                (studentId) => studentId !== id,
              ),
            };
          } else {
            // Clear previous selection and select this student (single select)
            return {
              selectedStudents: [id],
            };
          }
        }),

      selectAllStudents: (studentIds) => set({ selectedStudents: studentIds }),

      clearSelectedStudents: () => set({ selectedStudents: [] }),

      setFilters: (filters) => set({ filters }),

      setColumnFilter: (clause, columnId) =>
        set((state) => {
          const newFilters = { ...state.filters };
          if (clause) {
            newFilters[columnId] = clause;
          } else {
            delete newFilters[columnId];
          }
          return { filters: newFilters };
        }),

      clearFilter: (columnId) =>
        set((state) => {
          const newFilters = { ...state.filters };
          delete newFilters[columnId];
          return { filters: newFilters };
        }),

      clearAllFilters: () => set({ filters: {} }),

      reset: () => set(initialState),
    }),
    {
      name: "student-ui-store",
      storage: createJSONStorage(() => sessionStorage),
      // Persist query parameters for restoration
      partialize: (state) => ({
        queryParams: state.queryParams,
        filters: state.filters,
      }),
    },
  ),
);
