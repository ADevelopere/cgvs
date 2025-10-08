"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    ReactNode,
    useState,
    useEffect,
} from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
    DateFilterOperation,
    TextFilterOperation,
    DateFilterValue,
    FilterClause,
} from "@/client/types/filters";
import { useStudentManagement } from "./StudentManagementContext";
import { getColumnDef, mapDateFilter, mapTextFilter } from "./utils/filter";
import logger from "@/lib/logger";

// Helper function to map table column IDs to GraphQL OrderStudentsByColumn enum values
const mapColumnIdToGraphQLColumn = (
    columnId: string,
): Graphql.StudentsOrderByColumn | null => {
    const columnMap: Record<string, Graphql.StudentsOrderByColumn> = {
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
    filters: Record<string, FilterClause<unknown, unknown> | null>;
    applyFilters: (params: ApplyFiltersParams) => void;
    setSearchFilter: (
        filterClause: FilterClause<unknown, unknown> | null,
    ) => void;
    setColumnFilter: (
        filterClause: FilterClause<unknown, unknown> | null,
        columnId: string,
    ) => void;
    clearFilter: (columnId: keyof Graphql.Student) => void;
    clearAllFilters: () => void;
    updateSort: (
        orderByClause: { column: string; order: Graphql.OrderSortDirection }[],
    ) => void;
};

// Create the context
const StudentFilterAndSortContext =
    createContext<StudentFilterAndSortContextType | null>(null);

// Create the provider component
export const StudentFilterAndSortProvider: React.FC<{
    children: ReactNode;
}> = ({ children }) => {
    const { setQueryParams } = useStudentManagement();
    const [activeFilters, setActiveFilters] = useState<
        Record<string, FilterClause | null>
    >({});

    // This effect syncs the activeFilters state with the query parameters
    useEffect(() => {
        const newFilterArgs: Partial<Graphql.StudentFilterArgs> = {};

        Object.values(activeFilters).forEach((filterClause) => {
            if (!filterClause) return;

            const columnId = filterClause.columnId as keyof Graphql.Student;
            const columnDef = getColumnDef(columnId);
            if (!columnDef) return;

            let mappedFilter: Partial<Graphql.StudentFilterArgs> = {};
            if (columnDef.type === "text" || columnDef.type === "phone") {
                mappedFilter = mapTextFilter(
                    columnId,
                    filterClause.operation as TextFilterOperation,
                    filterClause.value,
                );
            } else if (columnDef.type === "date") {
                mappedFilter = mapDateFilter(
                    columnId,
                    filterClause.operation as DateFilterOperation,
                    filterClause.value,
                );
            }
            Object.assign(newFilterArgs, mappedFilter);
        });

        const queryUpdate: Partial<Graphql.StudentsQueryVariables> = {
            filterArgs: newFilterArgs,
            paginationArgs: {
                first: 100,
                page: 1,
            },
        };

        setQueryParams(queryUpdate);
    }, [activeFilters, setQueryParams]);

    const applyFilters = useCallback((params: ApplyFiltersParams) => {
        const { columnId, filters: newColumnFilters } = params;

        setActiveFilters((prev) => {
            const newFilters = { ...prev };
            const filterEntries = Object.entries(newColumnFilters);

            if (filterEntries.length > 0) {
                // This logic assumes one operation per column from the popovers.
                const [op, value] = filterEntries[0];
                newFilters[columnId as string] = {
                    columnId: columnId as string,
                    operation: op,
                    value,
                };
            } else {
                delete newFilters[columnId as string];
            }
            return newFilters;
        });
    }, []);

    const clearFilter = useCallback((columnId: keyof Graphql.Student) => {
        setActiveFilters((prev) => {
            const newFilters = { ...prev };
            delete newFilters[columnId as string];
            return newFilters;
        });
    }, []);

    const clearAllFilters = useCallback(() => {
        setActiveFilters({});
    }, []);

    const setSearchFilter = useCallback((filterClause: FilterClause | null) => {
        if (!filterClause) {
            setActiveFilters({});
        } else {
            // This replaces all other filters, which is the desired behavior for the search bar.
            setActiveFilters({ [filterClause.columnId]: filterClause });
        }
    }, []);

    const setColumnFilter = useCallback(
        (filterClause: FilterClause | null, columnId: string) => {
            setActiveFilters((prev) => {
                const newFilters = { ...prev };
                if (filterClause) {
                    newFilters[columnId] = filterClause;
                } else {
                    delete newFilters[columnId];
                }
                return newFilters;
            });
        },
        [],
    );

    const updateSort = useCallback(
        (
            orderByClause: {
                column: string;
                order: Graphql.OrderSortDirection;
            }[],
        ) => {
            // Convert generic OrderByClause to GraphQL-specific OrderStudentsByClauseInput
            const graphqlOrderBy: Graphql.StudentsOrderByClause[] =
                orderByClause
                    .map((clause) => {
                        const graphqlColumn = mapColumnIdToGraphQLColumn(
                            clause.column,
                        );
                        if (!graphqlColumn) {
                            logger.warn(
                                `Column ${clause.column} is not sortable in GraphQL schema`,
                            );
                            return null;
                        }
                        const retult: Graphql.StudentsOrderByClause = {
                            column: graphqlColumn,
                            order: clause.order,
                        };
                        return retult;
                    })
                    .filter(
                        (clause): clause is Graphql.StudentsOrderByClause =>
                            clause !== null,
                    );

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
            filters: activeFilters,
            applyFilters,
            setSearchFilter,
            setColumnFilter,
            clearFilter,
            clearAllFilters,
            updateSort,
        }),
        [
            activeFilters,
            applyFilters,
            setSearchFilter,
            setColumnFilter,
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
