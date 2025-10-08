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
} from "@/client/types/filters";
import { useTableContext } from "./TableContext";
import { OrderSortDirection } from "@/client/graphql/generated/gql/graphql";

export type TableCellEditingState = {
    isEditing: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tmpValue: any;
    errorMessage: string | null;
};

type OrderByClause = {
    column: string;
    order: OrderSortDirection;
};
export type TableDataContextType = {
    // Sorting
    orderByClause: OrderByClause[];
    sort: (columnId: string) => void;
    getSortDirection: (columnId: string) => OrderSortDirection | null;

    // Filtering
    filters: Record<string, FilterClause<unknown, unknown> | null>;

    filter: (
        filterClause: FilterClause<unknown, unknown> | null,
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
    onFilterChange?: (
        filterClause: FilterClause<unknown, unknown> | null,
        columnId: string,
    ) => void;
    onSort?: (orderByClause: OrderByClause[]) => void;
    children: React.ReactNode;
    filters?: Record<string, FilterClause<unknown, unknown> | null>;
};

export const TableDataProvider = ({
    onFilterChange,
    onSort,
    children,
    filters = {},
}: TableDataProviderProps) => {
    const { columns } = useTableContext();

    const [orderByClause, setOrderByClause] = useState<OrderByClause[]>([]);
    const [tempFilterValues, setTempFilterValues] = useState<
        Record<string, string>
    >({});

    // Cell editing state management
    const [editingCells, setEditingCells] = useState<
        Record<string, TableCellEditingState>
    >({});

    useEffect(() => {
        onSort?.(orderByClause);
    }, [onSort, orderByClause]);

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

    // Filter handling
    const filter = useCallback(
        (filterClause: FilterClause | null, columnId: string) => {
            onFilterChange?.(filterClause, columnId);
        },
        [onFilterChange],
    );

    const applyFilter = useCallback(
        (columnId: string) => {
            const value = tempFilterValues[columnId];
            const column = columns.find((col) => col.id === columnId);
            if (!column) return;

            // Handle client-side filtering
            let operation;
            if (column.type === "number") {
                operation = NumberFilterOperation.equals;
            } else if (column.type === "date") {
                operation = DateFilterOperation.is;
            } else {
                operation = TextFilterOperation.contains;
            }

            const filterClause = value
                ? {
                      columnId,
                      operation,
                      value: column.type === "number" ? Number(value) : value,
                  }
                : null;
            onFilterChange?.(filterClause, columnId);
        },
        [columns, tempFilterValues, onFilterChange],
    );

    // Helper to get the active text filter for a column
    const getActiveTextFilter = useCallback(
        (
            columnId: string,
        ): FilterClause<string, TextFilterOperation> | null => {
            // Then check client filters
            const filter = filters?.[columnId];
            if (!filter) return null;

            // Handle legacy string filters
            if (typeof filter === "string") {
                return {
                    columnId,
                    operation: TextFilterOperation.contains,
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
            const filter = filters?.[columnId];
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
            const filter = filters?.[columnId];
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
            onFilterChange?.(filterClause, filterClause.columnId);
        },
        [onFilterChange],
    );

    const applyNumberFilter = useCallback(
        (filterClause: FilterClause<number, NumberFilterOperation>) => {
            onFilterChange?.(filterClause, filterClause.columnId);
        },
        [onFilterChange],
    );

    const applyDateFilter = useCallback(
        (filterClause: FilterClause<DateFilterValue, DateFilterOperation>) => {
            onFilterChange?.(filterClause, filterClause.columnId);
        },
        [onFilterChange],
    );

    // Clear filter for a specific column
    const clearFilter = useCallback(
        (columnId: string) => {
            onFilterChange?.(null, columnId);
        },
        [onFilterChange],
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
        (columnId: string): OrderSortDirection | null => {
            const clause = orderByClause.find(
                (sortClause) => sortClause.column === columnId,
            );
            return clause?.order ?? null;
        },
        [orderByClause],
    );

    const value: TableDataContextType = useMemo(
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
