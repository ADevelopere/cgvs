import {
  createContext,
  useContext,
  useState,
  useEffect,
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
import { Column } from "@/types/table.type";
import { useTableContext } from "./TableContext";

export type TableDataContextType = {
  // Sorting
  sortBy: string | null;
  sortDirection: "asc" | "desc" | null;
  sort: (columnId: string) => void;

  // Filtering
  filters: Record<string, FilterClause<any, any>>;

  serverOperationMode: boolean;
  activeServerFilters: FilterClause<any, any>[];
  getActiveServerFilter: (columnId: string) => FilterClause<any, any> | null;
  filter: (
    filterClause: FilterClause<any, any> | null,
    columnId: string
  ) => void;

  tempFilterValues: Record<string, string>;
  setTempFilterValues: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;

  applyFilter: (columnId: string) => void;

  applyTextFilter: (
    filterClause: FilterClause<string, TextFilterOperation>
  ) => void;
  getActiveTextFilter: (
    columnId: string
  ) => FilterClause<string, TextFilterOperation> | null;

  applyDateFilter: (
    filterClause: FilterClause<DateFilterValue, DateFilterOperation>
  ) => void;
  getActiveDateFilter: (
    columnId: string
  ) => FilterClause<DateFilterValue, DateFilterOperation> | null;

  applyNumberFilter: (
    filterClause: FilterClause<number, NumberFilterOperation>
  ) => void;
  getActiveNumberFilter: (
    columnId: string
  ) => FilterClause<number, NumberFilterOperation> | null;

  clearFilter: (columnId: string) => void;
};

const TableDataContext = createContext<TableDataContextType | null>(null);

export type TableDataProviderProps = {
  onFilter?: (
    filterClause: FilterClause<any, any> | null,
    columnId: string
  ) => void;
  onSort?: (columnId: string) => void;
  children: React.ReactNode;
};

export const TableDataProvider = ({
  onFilter,
  onSort,
  children,
}: TableDataProviderProps) => {
  const {columns}  = useTableContext();

  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );

  const [filters, setFilters] = useState<
    Record<string, FilterClause<any, any>>
  >({});

  // State to track temporary filter values before they're applied
  const [tempFilterValues, setTempFilterValues] = useState<
    Record<string, string>
  >({});

  // Initialize inline filter values and operations from active server filters
  useEffect(() => {
    if (serverOperationMode && serverFilterUi === "inlineHeaderRow") {
      const initialValues: Record<string, string> = {};
      const initialOperations: Record<string, string> = {};

      activeServerFilters.forEach((filter) => {
        const column = columns.find((col) => col.id === filter.columnId);
        if (!column || !column.serverFilterable) return;

        if (
          isTextFilterOperation(filter.operation) ||
          isNumberFilterOperation(filter.operation)
        ) {
          initialValues[filter.columnId] =
            filter.value !== undefined ? String(filter.value) : "";
          initialOperations[filter.columnId] = filter.operation;
        } else if (isDateFilterOperation(filter.operation)) {
          // For date filters, handle the from/to values
          const dateValue = filter.value as DateFilterValue;
          if (dateValue?.from) {
            initialValues[`${filter.columnId}_from`] =
              typeof dateValue.from === "string"
                ? dateValue.from
                : dateValue.from.toISOString().split("T")[0];
          }
          if (dateValue?.to) {
            initialValues[`${filter.columnId}_to`] =
              typeof dateValue.to === "string"
                ? dateValue.to
                : dateValue.to.toISOString().split("T")[0];
          }
          initialOperations[filter.columnId] = filter.operation;
        }
      });

      setInlineFilterValues(initialValues);
      setInlineFilterOperations(initialOperations);
    }
  }, [columns]);

  // Filter handling
  const filter = useCallback(
    (filterClause: FilterClause<any, any> | null, columnId: string) => {
      const column = columns.find((col: Column) => col.id === columnId);

      if (serverOperationMode && column?.serverFilterable) {
        setActiveServerFilters((prev) => {
          if (!filterClause) {
            return prev.filter((f) => f.columnId !== columnId);
          }

          const existingIndex = prev.findIndex((f) => f.columnId === columnId);
          if (existingIndex >= 0) {
            const newFilters = [...prev];
            newFilters[existingIndex] = filterClause;
            return newFilters;
          }
          return [...prev, filterClause];
        });
      } else {
      }
    },
    [columns, serverOperationMode, onFilter]
  );

  const applyFilter = useCallback(
    (columnId: string) => {
      const value = tempFilterValues[columnId];
      const column = columns.find((col) => col.id === columnId);
      if (!column) return;

      if (serverOperationMode && column.serverFilterable) {
        // Handle server-side filtering
        const existingFilterIndex = activeServerFilters.findIndex(
          (f) => f.columnId === columnId
        );
        const newFilters = [...activeServerFilters];

        const filterClause = value
          ? {
              columnId,
              operation:
                column.type === "number"
                  ? NumberFilterOperation.EQUALS
                  : column.type === "date"
                  ? DateFilterOperation.IS
                  : TextFilterOperation.CONTAINS,
              value: column.type === "number" ? Number(value) : value,
            }
          : null;

        if (filterClause) {
          if (existingFilterIndex >= 0) {
            newFilters[existingFilterIndex] = filterClause;
          } else {
            newFilters.push(filterClause);
          }
        } else if (existingFilterIndex >= 0) {
          newFilters.splice(existingFilterIndex, 1);
        }

        onServerFiltersChange?.(newFilters);
      } else {
        // Handle client-side filtering
        onFilter?.(
          value
            ? {
                columnId,
                operation:
                  column.type === "number"
                    ? NumberFilterOperation.EQUALS
                    : column.type === "date"
                    ? DateFilterOperation.IS
                    : TextFilterOperation.CONTAINS,
                value: column.type === "number" ? Number(value) : value,
              }
            : null,
          columnId
        );
      }
    },
    [
      columns,
      serverOperationMode,
      activeServerFilters,
      tempFilterValues,
      onFilter,
      onServerFiltersChange,
    ]
  );

  // Apply inline filter
  const applyInlineFilter = useCallback(
    (columnId: string, columnType: string) => {
      const operation = inlineFilterOperations[columnId];

      if (!operation) return;

      let filterClause: FilterClause<any, any> | null = null;

      if (
        columnType === "text" &&
        isTextFilterOperation(operation as TextFilterOperation)
      ) {
        filterClause = {
          columnId,
          operation: operation as TextFilterOperation,
          value: inlineFilterValues[columnId] || "",
        };
      } else if (
        columnType === "number" &&
        isNumberFilterOperation(operation as NumberFilterOperation)
      ) {
        filterClause = {
          columnId,
          operation: operation as NumberFilterOperation,
          value: inlineFilterValues[columnId]
            ? Number(inlineFilterValues[columnId])
            : undefined,
        };
      } else if (
        columnType === "date" &&
        isDateFilterOperation(operation as DateFilterOperation)
      ) {
        const fromValue = inlineFilterValues[`${columnId}_from`] || null;
        const toValue = inlineFilterValues[`${columnId}_to`] || null;

        filterClause = {
          columnId,
          operation: operation as DateFilterOperation,
          value: {
            from: fromValue,
            to: toValue,
          } as DateFilterValue,
        };
      }

      // Find the existing filter index
      const existingFilterIndex = activeServerFilters.findIndex(
        (f) => f.columnId === columnId
      );

      // Create a new array of filters
      const newFilters = [...activeServerFilters];

      if (filterClause) {
        if (existingFilterIndex >= 0) {
          // Replace existing filter
          newFilters[existingFilterIndex] = filterClause;
        } else {
          // Add new filter
          newFilters.push(filterClause);
        }
      } else {
        // Remove filter if it exists
        if (existingFilterIndex >= 0) {
          newFilters.splice(existingFilterIndex, 1);
        }
      }

      // Call the parent's onServerFiltersChange
      if (onServerFiltersChange) {
        onServerFiltersChange(newFilters);
      }
    },
    [
      inlineFilterValues,
      inlineFilterOperations,
      activeServerFilters,
      onServerFiltersChange,
    ]
  );

  // Handle inline filter value change
  const updateInlineFilterValue = useCallback(
    (columnId: string, value: string) => {
      setInlineFilterValues((prev) => ({
        ...prev,
        [columnId]: value,
      }));
    },
    []
  );

  // Handle inline filter date value change
  const updateInlineDateFilterValue = useCallback(
    (columnId: string, field: "from" | "to", value: string) => {
      setInlineFilterValues((prev) => ({
        ...prev,
        [`${columnId}_${field}`]: value,
      }));
    },
    []
  );

  // Handle inline filter operation change
  const updateInlineFilterOperation = useCallback(
    (columnId: string, operation: string) => {
      setInlineFilterOperations((prev) => ({
        ...prev,
        [columnId]: operation,
      }));
    },
    []
  );

  // Clear inline filter
  const clearInlineFilter = useCallback(
    (columnId: string) => {
      // Clear the filter values and operations
      setInlineFilterValues((prev) => {
        const newValues = { ...prev };
        delete newValues[columnId];
        delete newValues[`${columnId}_from`];
        delete newValues[`${columnId}_to`];
        return newValues;
      });

      setInlineFilterOperations((prev) => {
        const newOperations = { ...prev };
        delete newOperations[columnId];
        return newOperations;
      });

      // Find the existing filter index
      const existingFilterIndex = activeServerFilters.findIndex(
        (f) => f.columnId === columnId
      );

      // If the filter exists, remove it
      if (existingFilterIndex >= 0) {
        const newFilters = [...activeServerFilters];
        newFilters.splice(existingFilterIndex, 1);

        // Call the parent's onServerFiltersChange
        if (onServerFiltersChange) {
          onServerFiltersChange(newFilters);
        }
      }
    },
    [activeServerFilters, onServerFiltersChange]
  );

  // Helper to get the active text filter for a column
  const getActiveTextFilter = useCallback(
    (columnId: string): FilterClause<string, TextFilterOperation> | null => {
      // First check for server filters if in server mode
      if (serverOperationMode) {
        const column = columns.find((col) => col.id === columnId);
        if (column?.serverFilterable) {
          const serverFilter = activeServerFilters.find(
            (f) => f.columnId === columnId
          );
          if (serverFilter && isTextFilterOperation(serverFilter.operation)) {
            return serverFilter as FilterClause<string, TextFilterOperation>;
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
    },
    [
      serverOperationMode,
      activeServerFilters,
      columns,
      filters,
      setActiveServerFilters,
    ]
  );
  // Helper to get the active number filter for a column
  const getActiveNumberFilter = useCallback(
    (columnId: string): FilterClause<number, NumberFilterOperation> | null => {
      // First check for server filters if in server mode
      if (serverOperationMode) {
        const column = columns.find((col) => col.id === columnId);
        if (column?.serverFilterable) {
          const serverFilter = activeServerFilters.find(
            (f) => f.columnId === columnId
          );
          if (serverFilter && isNumberFilterOperation(serverFilter.operation)) {
            return serverFilter as FilterClause<number, NumberFilterOperation>;
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
    },
    [serverOperationMode, activeServerFilters, columns, filters]
  );

  // Helper to get the active date filter for a column
  const getActiveDateFilter = useCallback(
    (
      columnId: string
    ): FilterClause<DateFilterValue, DateFilterOperation> | null => {
      // First check for server filters if in server mode
      if (serverOperationMode) {
        const column = columns.find((col) => col.id === columnId);
        if (column?.serverFilterable) {
          const serverFilter = activeServerFilters.find(
            (f) => f.columnId === columnId
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
    },
    [serverOperationMode, activeServerFilters, columns, filters]
  );

  // Helper to get an active server filter for a column
  const getActiveServerFilter = useCallback(
    (columnId: string): FilterClause<any, any> | null => {
      return (
        activeServerFilters.find((filter) => filter.columnId === columnId) ||
        null
      );
    },
    [activeServerFilters]
  );

  const applyTextFilter = (
    filterClause: FilterClause<string, TextFilterOperation>
  ) => {
    if (serverOperationMode) {
      // Update server filters
      const existingFilterIndex = activeServerFilters.findIndex(
        (f) => f.columnId === filterClause.columnId
      );
      const newFilters = [...activeServerFilters];

      if (existingFilterIndex >= 0) {
        newFilters[existingFilterIndex] = filterClause;
      } else {
        newFilters.push(filterClause);
      }

      onServerFiltersChange?.(newFilters);
    } else {
      // Update client filters
      onFilter?.(filterClause, filterClause.columnId);
    }
  };

  const applyNumberFilter = useCallback(
    (filterClause: FilterClause<number, NumberFilterOperation>) => {
      if (serverOperationMode) {
        // Update server filters
        const existingFilterIndex = activeServerFilters.findIndex(
          (f) => f.columnId === filterClause.columnId
        );
        const newFilters = [...activeServerFilters];

        if (existingFilterIndex >= 0) {
          newFilters[existingFilterIndex] = filterClause;
        } else {
          newFilters.push(filterClause);
        }

        onServerFiltersChange?.(newFilters);
      } else {
        // Update client filters
        onFilter?.(filterClause, filterClause.columnId);
      }
    },
    [serverOperationMode, activeServerFilters, onFilter, onServerFiltersChange]
  );

  const applyDateFilter = useCallback(
    (filterClause: FilterClause<DateFilterValue, DateFilterOperation>) => {
      if (serverOperationMode) {
        // Update server filters
        const existingFilterIndex = activeServerFilters.findIndex(
          (f) => f.columnId === filterClause.columnId
        );
        const newFilters = [...activeServerFilters];

        if (existingFilterIndex >= 0) {
          newFilters[existingFilterIndex] = filterClause;
        } else {
          newFilters.push(filterClause);
        }

        onServerFiltersChange?.(newFilters);
      } else {
        // Update client filters
        onFilter?.(filterClause, filterClause.columnId);
      }
    },
    [serverOperationMode, activeServerFilters, onFilter, onServerFiltersChange]
  );

  // Clear filter for a specific column
  const clearFilter = useCallback(
    (columnId: string) => {
      if (serverOperationMode) {
        // Remove from server filters
        const existingFilterIndex = activeServerFilters.findIndex(
          (f) => f.columnId === columnId
        );
        if (existingFilterIndex >= 0) {
          const newFilters = [...activeServerFilters];
          newFilters.splice(existingFilterIndex, 1);
          onServerFiltersChange?.(newFilters);
        }
      } else {
        // Clear client filter
        onFilter?.(null, columnId);
      }
    },
    [serverOperationMode, activeServerFilters, onFilter, onServerFiltersChange]
  );

  // Sort handling
  const sort = useCallback(
    (columnId: string) => {
      const column = columns.find((col: Column) => col.id === columnId);

      if (serverOperationMode && column?.serverSortable && onServerSortChange) {
        let nextSortDirection: "asc" | "desc" | null = "asc";
        if (sortBy === columnId) {
          nextSortDirection = sortDirection === "asc" ? "desc" : null;
        }

        if (nextSortDirection) {
          onServerSortChange({ columnId, direction: nextSortDirection });
        } else {
          onServerSortChange(undefined);
        }
      } else {
        onSort?.(columnId);
      }
    },
    [
      columns,
      serverOperationMode,
      onServerSortChange,
      sortBy,
      sortDirection,
      onSort,
    ]
  );

  // Notify parent of server filter changes
  useEffect(() => {
    if (serverOperationMode && onServerFiltersChange) {
      onServerFiltersChange(activeServerFilters);
    }
  }, [serverOperationMode, onServerFiltersChange, activeServerFilters]);

  const value: TableDataContextType = useMemo(
    () => ({
      sortBy,
      sortDirection,
      sort,

      serverOperationMode,

      activeServerFilters,
      getActiveServerFilter,
      filters,
      filter,
      tempFilterValues,
      setTempFilterValues,

      applyFilter,
      applyInlineFilter,
      clearInlineFilter,
      applyTextFilter,
      getActiveTextFilter,
      applyNumberFilter,
      getActiveNumberFilter,
      clearFilter,
      applyDateFilter,
      getActiveDateFilter,

      inlineFilterOperations,
      inlineFilterValues,
      updateInlineFilterValue,
      updateInlineDateFilterValue,
      updateInlineFilterOperation,
    }),
    [
      sort,
      sortBy,
      sortDirection,
      serverOperationMode,
      filter,
      filters,
      tempFilterValues,
      setTempFilterValues,
      activeServerFilters,
      getActiveServerFilter,

      applyFilter,
      applyInlineFilter,
      clearInlineFilter,
      applyTextFilter,
      getActiveTextFilter,

      applyNumberFilter,
      getActiveNumberFilter,
      clearFilter,

      applyDateFilter,
      getActiveDateFilter,

      inlineFilterOperations,
      inlineFilterValues,
      updateInlineFilterValue,
      updateInlineDateFilterValue,
      updateInlineFilterOperation,
    ]
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
    throw new Error("useTableDataContext must be used within a TableProvider");
  }
  return context;
};

export default TableDataContext;
