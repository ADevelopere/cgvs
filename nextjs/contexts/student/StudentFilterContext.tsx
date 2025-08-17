import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    ReactNode,
} from "react";
import * as Graphql from "@/graphql/generated/types";
import {
    DateFilterOperation,
    TextFilterOperation,
    DateFilterValue,
    FilterClause,
} from "@/types/filters";
import { useStudentManagement } from "./StudentManagementContext";
import {
    getColumnDef,
    getQueryParamKeysForColumn,
    mapDateFilter,
    mapTextFilter,
} from "./utils/filter";
import { STUDENT_TABLE_COLUMNS } from "@/components/admin/student/column";

// Define the types for the filter operations and values
type TextFilterMap = Partial<Record<TextFilterOperation, string | boolean>>;
type DateFilterMap = Partial<
    Record<DateFilterOperation, DateFilterValue | string | boolean>
>;

// Type for the main applyFilters function parameter
type ApplyFiltersParams =
    | { columnId: keyof Graphql.Student; type: "text"; filters: TextFilterMap }
    | {
          columnId: keyof Graphql.Student;
          type: "date";
          filters: DateFilterMap;
      };

// Type for the context value
type StudentFilterAndSortContextType = {
    applyFilters: (params: ApplyFiltersParams) => void;
    applySingleFilter: (filterClause: FilterClause<any, any> | null) => void;
    clearFilter: (columnId: keyof Graphql.Student) => void;
    clearAllFilters: () => void;
    updateSort: (orderByClause: Graphql.OrderByClause[]) => void;
};

// Create the context
const StudentFilterAndSortContext =
    createContext<StudentFilterAndSortContextType | null>(null);

// Create the provider component
export const StudentFilterAndSortProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const { setQueryParams } = useStudentManagement();

    const applyFilters = useCallback(
        (params: ApplyFiltersParams) => {
            const { columnId, type, filters } = params;
            const keysToClear = getQueryParamKeysForColumn(columnId);
            const queryUpdate: Partial<Graphql.StudentsQueryVariables> = {};

            keysToClear.forEach((key) => {
                queryUpdate[key] = undefined; // Clear existing filters for this column
            });

            // Map the new filters based on type
            if (type === "text") {
                Object.entries(filters).forEach(([op, value]) => {
                    const mappedParams = mapTextFilter(
                        columnId,
                        op as TextFilterOperation,
                        value,
                    );
                    Object.assign(queryUpdate, mappedParams);
                });
            } else if (type === "date") {
                Object.entries(filters).forEach(([op, value]) => {
                    const mappedParams = mapDateFilter(
                        columnId,
                        op as DateFilterOperation,
                        value,
                    );
                    Object.assign(queryUpdate, mappedParams);
                });
            }

            setQueryParams({ ...queryUpdate, page: 1 }); // Apply update and reset page
        },
        [setQueryParams],
    );

    const clearFilter = useCallback(
        (columnId: keyof Graphql.Student) => {
            const keysToClear = getQueryParamKeysForColumn(columnId);
            const queryUpdate: Partial<Graphql.StudentsQueryVariables> = {};
            keysToClear.forEach((key) => {
                queryUpdate[key] = undefined;
            });
            setQueryParams({ ...queryUpdate, page: 1 }); // Apply update and reset page
        },
        [setQueryParams],
    );

    const clearAllFilters = useCallback(() => {
        const queryUpdate: Partial<Graphql.StudentsQueryVariables> = {};
        // Iterate over columns configured for server filtering
        STUDENT_TABLE_COLUMNS.forEach((col) => {
            const keysToClear = getQueryParamKeysForColumn(
                col.id as keyof Graphql.Student, // Assuming col.id is a valid keyof Student
            );
            keysToClear.forEach((key) => {
                queryUpdate[key] = undefined;
            });
        });
        // Also clear enum filters if they exist and are handled separately
        queryUpdate.gender = undefined;
        queryUpdate.nationality = undefined;

        setQueryParams({ ...queryUpdate, page: 1 }); // Apply update and reset page
    }, [setQueryParams]);

    const applySingleFilter = useCallback(
        (filterClause: FilterClause<any, any> | null) => {
            if (!filterClause) {
                clearAllFilters();
                return;
            }

            const columnId = filterClause.columnId as keyof Graphql.Student;
            const columnDef = getColumnDef(columnId);
            if (!columnDef) {
                console.warn(`Column definition not found for ${columnId}`);
                return;
            }

            // Determine the type and construct the filters map
            let params: ApplyFiltersParams | null = null;
            if (columnDef.type === "text" || columnDef.type === "string") {
                const filters: TextFilterMap = {
                    [filterClause.operation as TextFilterOperation]:
                        filterClause.value,
                };
                params = { columnId, type: "text", filters };
            } else if (columnDef.type === "date") {
                const filters: DateFilterMap = {
                    [filterClause.operation as DateFilterOperation]:
                        filterClause.value,
                };
                params = { columnId, type: "date", filters };
            }
            // Add other types like 'number', 'enum' if needed

            if (params) {
                applyFilters(params);
            } else {
                console.warn(`Unsupported column type for ${columnId}`);
            }
        },
        [applyFilters, clearAllFilters],
    );

    const updateSort = useCallback(
        (orderByClause: Graphql.OrderByClause[]) => {
            setQueryParams({
                orderBy: orderByClause,
                page: 1,
            });
        },
        [setQueryParams],
    );

    // Memoize the context value
    const value = useMemo(
        () => ({
            applyFilters,
            applySingleFilter,
            clearFilter,
            clearAllFilters,
            updateSort,
        }),
        [
            applyFilters,
            applySingleFilter,
            clearFilter,
            clearAllFilters,
            updateSort,
        ],
    );

    return (
        <StudentFilterAndSortContext.Provider value={value}>
            {children}
        </StudentFilterAndSortContext.Provider>
    );
};

// Create the custom hook to use the context
export const useStudentFilter = (): StudentFilterAndSortContextType => {
    const context = useContext(StudentFilterAndSortContext);
    if (!context) {
        throw new Error(
            "useStudentFilter must be used within a StudentFilterProvider",
        );
    }
    return context;
};
