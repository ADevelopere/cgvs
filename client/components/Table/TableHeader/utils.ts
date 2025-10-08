import {
    FilterClause,
    TextFilterOperation,
    NumberFilterOperation,
    DateFilterOperation,
    DateFilterValue,
    isTextFilterOperation,
    isNumberFilterOperation,
    isDateFilterOperation,
} from "@/client/types/filters";

/**
 * Get the active text filter for a column
 */
export const getActiveTextFilter = (
    columnId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any>,
): FilterClause<string, TextFilterOperation> | null => {
    // Then check client filters
    const filter = filters[columnId];
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
};

/**
 * Get the active number filter for a column
 */
export const getActiveNumberFilter = (
    columnId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any>,
): FilterClause<number, NumberFilterOperation> | null => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: Record<string, any>,
): FilterClause<DateFilterValue, DateFilterOperation> | null => {


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
 * Determine the state of the "select all" checkbox
 */
export const getSelectAllCheckboxState = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
