import { Column } from "@/types/table.type";
import {
    FilterClause,
    TextFilterOperation,
    NumberFilterOperation,
    DateFilterOperation,
    DateFilterValue,
    isTextFilterOperation,
    isNumberFilterOperation,
    isDateFilterOperation,
} from "@/types/filters";

/**
 * Get the active text filter for a column
 */
export const getActiveTextFilter = (
    columnId: string,
    filters: Record<string, any>,
    serverOperationMode: boolean,
    columns: Column[],
    activeServerFilters: FilterClause<any, any>[],
): FilterClause<string, TextFilterOperation> | null => {
    // First check for server filters if in server mode
    if (serverOperationMode) {
        const column = columns.find((col) => col.id === columnId);
        if (column?.serverFilterable) {
            const serverFilter = activeServerFilters.find(
                (f) => f.columnId === columnId,
            );
            if (serverFilter && isTextFilterOperation(serverFilter.operation)) {
                return serverFilter as FilterClause<
                    string,
                    TextFilterOperation
                >;
            }
        }
    }

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
};

/**
 * Get the active number filter for a column
 */
export const getActiveNumberFilter = (
    columnId: string,
    filters: Record<string, any>,
    serverOperationMode: boolean,
    columns: Column[],
    activeServerFilters: FilterClause<any, any>[],
): FilterClause<number, NumberFilterOperation> | null => {
    // First check for server filters if in server mode
    if (serverOperationMode) {
        const column = columns.find((col) => col.id === columnId);
        if (column?.serverFilterable) {
            const serverFilter = activeServerFilters.find(
                (f) => f.columnId === columnId,
            );
            if (
                serverFilter &&
                isNumberFilterOperation(serverFilter.operation)
            ) {
                return serverFilter as FilterClause<
                    number,
                    NumberFilterOperation
                >;
            }
        }
    }

    // Then check client filters
    const filter = filters[columnId];
    if (!filter) return null;

    // Return the filter clause if it's a number filter
    if (filter.operation && isNumberFilterOperation(filter.operation)) {
        return filter as FilterClause<number, NumberFilterOperation>;
    }

    return null;
};

/**
 * Get the active date filter for a column
 */
export const getActiveDateFilter = (
    columnId: string,
    filters: Record<string, any>,
    serverOperationMode: boolean,
    columns: Column[],
    activeServerFilters: FilterClause<any, any>[],
): FilterClause<DateFilterValue, DateFilterOperation> | null => {
    // First check for server filters if in server mode
    if (serverOperationMode) {
        const column = columns.find((col) => col.id === columnId);
        if (column?.serverFilterable) {
            const serverFilter = activeServerFilters.find(
                (f) => f.columnId === columnId,
            );
            if (serverFilter && isDateFilterOperation(serverFilter.operation)) {
                return serverFilter as FilterClause<
                    DateFilterValue,
                    DateFilterOperation
                >;
            }
        }
    }

    // Then check client filters
    const filter = filters[columnId];
    if (!filter) return null;

    // Return the filter clause if it's a date filter
    if (filter.operation && isDateFilterOperation(filter.operation)) {
        return filter as FilterClause<DateFilterValue, DateFilterOperation>;
    }

    return null;
};

/**
 * Get an active server filter for a column
 */
export const getActiveServerFilter = (
    columnId: string,
    activeServerFilters: FilterClause<any, any>[],
): FilterClause<any, any> | null => {
    return (
        activeServerFilters.find((filter) => filter.columnId === columnId) ||
        null
    );
};

/**
 * Determine the state of the "select all" checkbox
 */
export const getSelectAllCheckboxState = (
    data: any[],
    selectedRowIds: Array<string | number>,
    rowIdKey: string = "id",
): boolean | null => {
    if (!data || data.length === 0 || !selectedRowIds) return false;

    const selectableRowIds = data.map((row) => row[rowIdKey]);
    const selectedCount = selectableRowIds.filter((id) =>
        selectedRowIds.includes(id),
    ).length;

    if (selectedCount === 0) return false;
    if (selectedCount === selectableRowIds.length) return true;
    return null; // indeterminate state
};
