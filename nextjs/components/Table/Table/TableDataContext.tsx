import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
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
import { SortDirection } from "@/graphql/generated/types";

export type TableCellEditingState = {
    isEditing: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tmpValue: any;
    errorMessage: string | null;
};

type OrderByClause = {
    column: string;
    order: SortDirection;
};
export type TableDataContextType = {
    // Sorting
    orderByClause: OrderByClause[];
    sort: (columnId: string) => void;
    getSortDirection: (columnId: string) => SortDirection | null;

    // Filtering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, FilterClause<any, any>>;

    filter: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    applyNumberFilter: (
        filterClause: FilterClause<number, NumberFilterOperation>,
    ) => void;
    getActiveNumberFilter: (
        columnId: string,
    ) => FilterClause<number, NumberFilterOperation> | null;

    applyDateFilter: (
        filterClause: FilterClause<DateFilterValue, DateFilterOperation>,
    ) => void;
    getActiveDateFilter: (
        columnId: string,
    ) => FilterClause<DateFilterValue, DateFilterOperation> | null;

    clearFilter: (columnId: string) => void;

    // Cell Editing
    getEditingState: (
        rowId: string | number,
        columnId: string,
    ) => TableCellEditingState | null;
    setEditingState: (
        rowId: string | number,
        columnId: string,
        state: TableCellEditingState | null,
    ) => void;
};

const TableDataContext = createContext<TableDataContextType | null>(null);

export type TableDataProviderProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onFilter?: (filterClause: FilterClause<any, any> | null) => void;
    onSort?: (orderByClause: OrderByClause[]) => void;
    children: React.ReactNode;
};

export const TableDataProvider = ({
    onFilter,
    onSort,
    children,
}: TableDataProviderProps) => {
    const { columns } = useTableContext();

    const [orderByClause, setOrderByClause] = useState<OrderByClause[]>([]);
    const [filters, setFilters] = useState<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Record<string, FilterClause<any, any>>
    >({});
    const [tempFilterValues, setTempFilterValues] = useState<
        Record<string, string>
    >({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [lastFilterApplied, setLastFilterApplied] = useState<{
        filterClause: FilterClause<any, any> | null;
        columnId: string;
    } | null>(null);

    // Cell editing state management
    const [editingCells, setEditingCells] = useState<
        Record<string, TableCellEditingState>
    >({});

    useEffect(() => {
        onSort?.(orderByClause);
    }, [onSort, orderByClause]);

    useEffect(() => {
        if (lastFilterApplied) {
            onFilter?.(lastFilterApplied.filterClause);
        }
    }, [lastFilterApplied, onFilter]);

    const getEditingState = useCallback(
        (
            rowId: string | number,
            columnId: string,
        ): TableCellEditingState | null => {
            const cellKey = `${rowId}:${columnId}`;
            return editingCells[cellKey] ?? null;
        },
        [editingCells],
    );

    const setEditingState = useCallback(
        (
            rowId: string | number,
            columnId: string,
            state: TableCellEditingState | null,
        ) => {
            const cellKey = `${rowId}:${columnId}`;
            setEditingCells((prev) => {
                if (state === null) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [cellKey]: removed, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [cellKey]: state };
            });
        },
        [],
    );

    // Internal filter update handler
    const handleFilterUpdate = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (filterClause: FilterClause<any, any> | null, columnId: string) => {
            // Update local filters state
            setFilters((prevFilters) => {
                if (filterClause === null) {
                    // If filter is null, remove the filter for this column
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { [columnId]: removed, ...rest } = prevFilters;
                    return rest;
                } else {
                    // Add or update the filter for this column
                    return {
                        ...prevFilters,
                        [columnId]: filterClause,
                    };
                }
            });
            setLastFilterApplied({ filterClause, columnId });
        },
        [],
    );

    // Filter handling
    const filter = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        [filters],
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
        [filters],
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
        [filters],
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
    const sort = useCallback((columnId: string) => {
        setOrderByClause((prevOrderByClause) => {
            const columnIndex = prevOrderByClause.findIndex(
                (clause) => clause.column === columnId,
            );

            let newOrderByClause = [...prevOrderByClause];

            if (columnIndex === -1) {
                // Add new sort
                newOrderByClause.push({
                    column: columnId,
                    order: "ASC",
                });
            } else if (newOrderByClause[columnIndex].order === "ASC") {
                // Change to DESC
                newOrderByClause[columnIndex] = {
                    ...newOrderByClause[columnIndex],
                    order: "DESC",
                };
            } else {
                // Remove sort
                newOrderByClause = newOrderByClause.filter(
                    (_, index) => index !== columnIndex,
                );
            }
            return newOrderByClause;
        });
    }, []);

    const getSortDirection = useCallback(
        (columnId: string): SortDirection | null => {
            const clause = orderByClause.find(
                (sortClause) => sortClause.column === columnId,
            );
            return clause?.order ?? null;
        },
        [orderByClause],
    );

    const value = useMemo(
        () => ({
            orderByClause,
            sort,
            getSortDirection,
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
            getEditingState,
            setEditingState,
        }),
        [
            orderByClause,
            sort,
            getSortDirection,
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
            getEditingState,
            setEditingState,
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
