import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from "react";
import {
    DateFilterOperation,
    isDateFilterOperation,
    isNumberFilterOperation,
    isTextFilterOperation,
    NumberFilterOperation,
    TextFilterOperation,
    type DateFilterValue,
    type FilterClause,
} from "@/types/filters";
import { useTableContext } from "./TableContext";

export type TableDataContextType = {
    // Sorting
    sortBy: string | null;
    sortDirection: "asc" | "desc" | null;
    sort: (columnId: string) => void;

    // Filtering
    filters: Record<string, FilterClause<any, any>>;

    filter: (
        filterClause: FilterClause<any, any> | null,
        columnId: string,
    ) => void;

    tempFilterValues: Record<string, string>;
    setTempFilterValues: React.Dispatch<
        React.SetStateAction<Record<string, string>>
    >;

    applyFilter: (columnId: string) => void;

    applyTextFilter: (
        filterClause: FilterClause<string, TextFilterOperation>,
    ) => void;
    getActiveTextFilter: (
        columnId: string,
    ) => FilterClause<string, TextFilterOperation> | null;

    applyDateFilter: (
        filterClause: FilterClause<DateFilterValue, DateFilterOperation>,
    ) => void;
    getActiveDateFilter: (
        columnId: string,
    ) => FilterClause<DateFilterValue, DateFilterOperation> | null;

    applyNumberFilter: (
        filterClause: FilterClause<number, NumberFilterOperation>,
    ) => void;
    getActiveNumberFilter: (
        columnId: string,
    ) => FilterClause<number, NumberFilterOperation> | null;

    clearFilter: (columnId: string) => void;
};

const TableDataContext = createContext<TableDataContextType | null>(null);

export type TableDataProviderProps = {
    onFilter?: (
        filterClause: FilterClause<any, any> | null,
        columnId: string,
    ) => void;
    onSort?: (columnId: string) => void;
    children: React.ReactNode;
};

export const TableDataProvider = ({
    onFilter,
    onSort,
    children,
}: TableDataProviderProps) => {
    const { columns } = useTableContext();

    const [sortBy, setSortBy] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
        null,
    );

    const [filters, setFilters] = useState<
        Record<string, FilterClause<any, any>>
    >({});

    // State to track temporary filter values before they're applied
    const [tempFilterValues, setTempFilterValues] = useState<
        Record<string, string>
    >({});

    // Internal filter update handler
    const handleFilterUpdate = useCallback(
        (filterClause: FilterClause<any, any> | null, columnId: string) => {
            // Update local filters state
            setFilters(prevFilters => {
                if (filterClause === null) {
                    // If filter is null, remove the filter for this column
                    const { [columnId]: removed, ...rest } = prevFilters;
                    return rest;
                } else {
                    // Add or update the filter for this column
                    return {
                        ...prevFilters,
                        [columnId]: filterClause
                    };
                }
            });

            // Call the onFilter callback
            onFilter?.(filterClause, columnId);
        },
        [onFilter]
    );

    // Filter handling
    const filter = useCallback(
        (filterClause: FilterClause<any, any> | null, columnId: string) => {
            handleFilterUpdate(filterClause, columnId);
        },
        [handleFilterUpdate],
    );

    const applyFilter = useCallback(
        (columnId: string) => {
            const value = tempFilterValues[columnId];
            const column = columns.find((col) => col.id === columnId);
            if (!column) return;

            // Handle client-side filtering
            let operation;
            if (column.type === "number") {
                operation = NumberFilterOperation.EQUALS;
            } else if (column.type === "date") {
                operation = DateFilterOperation.IS;
            } else {
                operation = TextFilterOperation.CONTAINS;
            }

            const filterClause = value
                ? {
                      columnId,
                      operation,
                      value: column.type === "number" ? Number(value) : value,
                  }
                : null;
            handleFilterUpdate(filterClause, columnId);
        },
        [columns, tempFilterValues, handleFilterUpdate],
    );

    // Helper to get the active text filter for a column
    const getActiveTextFilter = useCallback(
        (
            columnId: string,
        ): FilterClause<string, TextFilterOperation> | null => {
            // Then check client filters
            const filter = filters[columnId];
            if (!filter) return null;

            // Handle legacy string filters
            if (typeof filter === "string") {
                return {
                    columnId,
                    operation: TextFilterOperation.CONTAINS,
                    value: filter,
                };
            }

            // Return the filter clause if it's a text filter
            if (filter.operation && isTextFilterOperation(filter.operation)) {
                return filter as FilterClause<string, TextFilterOperation>;
            }

            return null;
        },
        [columns, filters],
    );
    // Helper to get the active number filter for a column
    const getActiveNumberFilter = useCallback(
        (
            columnId: string,
        ): FilterClause<number, NumberFilterOperation> | null => {
            // Then check client filters
            const filter = filters[columnId];
            if (!filter) return null;

            // Return the filter clause if it's a number filter
            if (filter.operation && isNumberFilterOperation(filter.operation)) {
                return filter as FilterClause<number, NumberFilterOperation>;
            }

            return null;
        },
        [columns, filters],
    );

    // Helper to get the active date filter for a column
    const getActiveDateFilter = useCallback(
        (
            columnId: string,
        ): FilterClause<DateFilterValue, DateFilterOperation> | null => {
            // Then check client filters
            const filter = filters[columnId];
            if (!filter) return null;

            // Return the filter clause if it's a date filter
            if (filter.operation && isDateFilterOperation(filter.operation)) {
                return filter as FilterClause<
                    DateFilterValue,
                    DateFilterOperation
                >;
            }

            return null;
        },
        [columns, filters],
    );

    const applyTextFilter = useCallback(
        (filterClause: FilterClause<string, TextFilterOperation>) => {
            handleFilterUpdate(filterClause, filterClause.columnId);
        },
        [handleFilterUpdate],
    );

    const applyNumberFilter = useCallback(
        (filterClause: FilterClause<number, NumberFilterOperation>) => {
            handleFilterUpdate(filterClause, filterClause.columnId);
        },
        [handleFilterUpdate],
    );

    const applyDateFilter = useCallback(
        (filterClause: FilterClause<DateFilterValue, DateFilterOperation>) => {
            handleFilterUpdate(filterClause, filterClause.columnId);
        },
        [handleFilterUpdate],
    );

    // Clear filter for a specific column
    const clearFilter = useCallback(
        (columnId: string) => {
            handleFilterUpdate(null, columnId);
        },
        [handleFilterUpdate],
    );

    // Sort handling
    const sort = useCallback(
        (columnId: string) => {
            onSort?.(columnId);
        },
        [columns, sortBy, sortDirection, onSort],
    );

    const value: TableDataContextType = useMemo(
        () => ({
            sortBy,
            sortDirection,
            sort,

            filters,
            filter,
            tempFilterValues,
            setTempFilterValues,

            applyFilter,
            applyTextFilter,
            getActiveTextFilter,
            applyNumberFilter,
            getActiveNumberFilter,
            clearFilter,
            applyDateFilter,
            getActiveDateFilter,
        }),
        [
            sort,
            sortBy,
            sortDirection,
            filter,
            filters,
            tempFilterValues,
            setTempFilterValues,

            applyFilter,
            applyTextFilter,
            getActiveTextFilter,

            applyNumberFilter,
            getActiveNumberFilter,
            clearFilter,

            applyDateFilter,
            getActiveDateFilter,
        ],
    );

    return (
        <TableDataContext.Provider value={value}>
            {children}
        </TableDataContext.Provider>
    );
};

export const useTableDataContext = () => {
    const context = useContext(TableDataContext);
    if (!context) {
        throw new Error(
            "useTableDataContext must be used within a TableProvider",
        );
    }
    return context;
};

export default TableDataContext;
