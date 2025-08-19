"use client";

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
    getFilterKeysForColumn,
    mapDateFilter,
    mapTextFilter,
} from "./utils/filter";

// Helper function to map table column IDs to GraphQL OrderStudentsByColumn enum values
const mapColumnIdToGraphQLColumn = (columnId: string): Graphql.OrderStudentsByColumn | null => {
    const columnMap: Record<string, Graphql.OrderStudentsByColumn> = {
        id: "ID",
        name: "NAME", 
        email: "EMAIL",
        dateOfBirth: "DATE_OF_BIRTH",
        gender: "GENDER",
        createdAt: "CREATED_AT",
        updatedAt: "UPDATED_AT",
        // phoneNumber and nationality are not sortable in the GraphQL schema
    };
    
    return columnMap[columnId] || null;
};

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
    updateSort: (orderByClause: { column: string; order: Graphql.SortOrder }[]) => void;
};

// Create the context
const StudentFilterAndSortContext =
    createContext<StudentFilterAndSortContextType | null>(null);

// Create the provider component
export const StudentFilterAndSortProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const { setQueryParams, queryParams } = useStudentManagement();

    const applyFilters = useCallback(
        (params: ApplyFiltersParams) => {
            const { columnId, type, filters } = params;
            
            // Start with existing filter args or empty object
            let newFilterArgs: Partial<Graphql.StudentFilterArgsInput> = {
                ...queryParams.filterArgs,
            };

            // Clear existing filters for this column first
            const filterKeysToRemove = getFilterKeysForColumn(columnId);
            filterKeysToRemove.forEach((key: keyof Graphql.StudentFilterArgsInput) => {
                delete (newFilterArgs as any)[key];
            });

            // Map the new filters based on type
            if (type === "text") {
                Object.entries(filters).forEach(([op, value]) => {
                    const mappedFilter = mapTextFilter(
                        columnId,
                        op as TextFilterOperation,
                        value,
                    );
                    Object.assign(newFilterArgs, mappedFilter);
                });
            } else if (type === "date") {
                Object.entries(filters).forEach(([op, value]) => {
                    const mappedFilter = mapDateFilter(
                        columnId,
                        op as DateFilterOperation,
                        value,
                    );
                    Object.assign(newFilterArgs, mappedFilter);
                });
            }

            // Update query with new filter args and reset pagination
            const queryUpdate: Partial<Graphql.StudentsQueryVariables> = {
                filterArgs: newFilterArgs,
                paginationArgs: {
                    first: 100, // Reset to default page size
                    page: 1,    // Reset to first page
                },
            };

            setQueryParams(queryUpdate);
        },
        [setQueryParams, queryParams.filterArgs],
    );

    const clearFilter = useCallback(
        (columnId: keyof Graphql.Student) => {
            // Start with existing filter args
            let newFilterArgs: Partial<Graphql.StudentFilterArgsInput> = {
                ...queryParams.filterArgs,
            };

            // Clear filters for this specific column
            const filterKeysToRemove = getFilterKeysForColumn(columnId);
            filterKeysToRemove.forEach((key: keyof Graphql.StudentFilterArgsInput) => {
                delete (newFilterArgs as any)[key];
            });

            const queryUpdate: Partial<Graphql.StudentsQueryVariables> = {
                filterArgs: newFilterArgs,
                paginationArgs: {
                    first: 100,
                    page: 1,
                },
            };
            setQueryParams(queryUpdate);
        },
        [setQueryParams, queryParams.filterArgs],
    );

    const clearAllFilters = useCallback(() => {
        const queryUpdate: Partial<Graphql.StudentsQueryVariables> = {
            filterArgs: {}, // Clear all filters
            paginationArgs: {
                first: 100,
                page: 1,
            },
        };

        setQueryParams(queryUpdate);
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
            if (columnDef.type === "text" || columnDef.type === "phone") {
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
        (orderByClause: { column: string; order: Graphql.SortOrder }[]) => {
            // Convert generic OrderByClause to GraphQL-specific OrderStudentsByClauseInput
            const graphqlOrderBy: Graphql.OrderStudentsByClauseInput[] = orderByClause
                .map(clause => {
                    const graphqlColumn = mapColumnIdToGraphQLColumn(clause.column);
                    if (!graphqlColumn) {
                        console.warn(`Column ${clause.column} is not sortable in GraphQL schema`);
                        return null;
                    }
                    return {
                        column: graphqlColumn,
                        order: clause.order,
                    };
                })
                .filter((clause): clause is Graphql.OrderStudentsByClauseInput => clause !== null);

            setQueryParams({
                orderBy: graphqlOrderBy,
                paginationArgs: {
                    first: 100,
                    page: 1,
                },
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
