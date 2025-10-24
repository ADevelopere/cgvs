"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { AnyColumn, PinPosition } from "@/client/components/Table/table.type";
import { useTableContext } from "./TableContext";
import { useTheme } from "@mui/material";

export type TableColumnContextType<TRowData = any> = {
  // Table data and configuration
  allColumns: AnyColumn<TRowData>[];
  columnWidths: Record<string, number>;
  visibleColumns: AnyColumn<TRowData>[];
  hiddenColumns: string[];
  // Column management
  pinnedColumns: Record<string, PinPosition>;
  setColumnWidths: (newWidths: Record<string, number>) => void;
  resizeColumn: (columnId: string, newWidth: number) => void;
  setColumnWidth: (columnId: string, newWidth: number) => void;
  pinColumn: (columnId: string, position: PinPosition) => void;
  hideColumn: (columnId: string) => void;
  showColumn: (columnId: string) => void;
  autosizeColumn?: (columnId: string) => void;
  pinnedLeftStyle: React.CSSProperties;
  pinnedRightStyle: React.CSSProperties;
};

const TableColumnContext = createContext<TableColumnContextType<any> | null>(null);

export type TableColumnsProviderProps<_TRowData = any> = {
  children: ReactNode;
  initialWidths: Record<string, number>;
  onResizeColumn?: (columnId: string, newWidth: number) => void;
  onPinColumn?: (columnId: string, position: PinPosition) => void;
  onHideColumn?: (columnId: string) => void;
  onShowColumn?: (columnId: string) => void;
  onAutosizeColumn?: (columnId: string) => void;
};

export const TableColumnsProvider = <TRowData = any,>({
  children,
  initialWidths,
  onResizeColumn,
  onPinColumn,
  onHideColumn,
  onShowColumn,
  onAutosizeColumn,
}: TableColumnsProviderProps<TRowData>) => {
  const theme = useTheme();
  const { columns } = useTableContext<TRowData>();

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    () => initialWidths
  );

  useEffect(() => {
    // Add missing columns from initialWidths if not present
    setColumnWidths(prev => {
      // Only add keys that are missing
      const updated = { ...prev };
      let changed = false;
      for (const col of columns) {
        if (!(col.id in updated) && initialWidths[col.id] !== undefined) {
          updated[col.id] = initialWidths[col.id];
          changed = true;
        }
      }
      return changed ? updated : prev;
    });
  }, [columns, initialWidths]);

  // Handle saving column width to localStorage
  const setColumnWidth = useCallback(
    (columnId: string, newWidth: number) => {
      const column = columns.find(col => col.id === columnId);
      if (column?.widthStorageKey) {
        localStorage.setItem(column.widthStorageKey, String(newWidth));
      }
      setColumnWidths(prevWidths => ({
        ...prevWidths,
        [columnId]: Math.max(newWidth, 50), // Ensure minimum width of 50px
      }));
    },
    [columns]
  );

  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = useState<
    Record<string, PinPosition>
  >({});

  // Column management methods
  const resizeColumn = useCallback(
    (columnId: string, newWidth: number) => {
      setColumnWidth(columnId, newWidth);
      onResizeColumn?.(columnId, newWidth);
    },
    [setColumnWidth, onResizeColumn]
  );

  const pinColumn = useCallback(
    (columnId: string, position: PinPosition) => {
      setPinnedColumns(prev => ({
        ...prev,
        [columnId]: position,
      }));
      onPinColumn?.(columnId, position);
    },
    [onPinColumn]
  );

  const hideColumn = useCallback(
    (columnId: string) => {
      setHiddenColumns(prev => [...prev, columnId]);
      onHideColumn?.(columnId);
    },
    [onHideColumn]
  );

  const showColumn = useCallback(
    (columnId: string) => {
      setHiddenColumns(prev => prev.filter(id => id !== columnId));
      onShowColumn?.(columnId);
    },
    [onShowColumn]
  );

  // Auto-size column method (simplified for generic architecture)
  const autosizeColumn = useCallback(
    (columnId: string) => {
      const column = columns.find((col) => col.id === columnId);
      if (!column) return;

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        // Try to find actual DOM elements to measure
        const headerCell = document.querySelector(`th[data-column-id="${columnId}"]`);
        const cells = document.querySelectorAll(`td[data-column-id="${columnId}"]`);

        let maxWidth = 50; // Minimum width

        // Measure header if available
        if (headerCell) {
          maxWidth = Math.max(maxWidth, headerCell.scrollWidth + 20);
        }

        // Measure data cells if available
        cells.forEach(cell => {
          maxWidth = Math.max(maxWidth, cell.scrollWidth + 20);
        });

        setColumnWidths(prev => ({
          ...prev,
          [columnId]: maxWidth,
        }));
      });
      onAutosizeColumn?.(columnId);
    },
    [columns, onAutosizeColumn]
  );

  // Filter out hidden columns
  const visibleColumns = useMemo(() => {
    return columns.filter(column => !hiddenColumns.includes(column.id));
  }, [columns, hiddenColumns]);

  // Group columns by pin position
  const leftPinnedColumns = useMemo(() => {
    return visibleColumns.filter(column => pinnedColumns[column.id] === "left");
  }, [visibleColumns, pinnedColumns]);

  const rightPinnedColumns = useMemo(() => {
    return visibleColumns.filter(
      column => pinnedColumns[column.id] === "right"
    );
  }, [visibleColumns, pinnedColumns]);

  // const unpinnedColumns = useMemo(() => {
  //     return;
  //     visibleColumns.filter((column) => !pinnedColumns[column.id]);
  // }, [visibleColumns, pinnedColumns]);

  // const leftPinnedWidth = useMemo(() => {
  //     return leftPinnedColumns.reduce(
  //         (sum, column) => sum + columnWidths[column.id],
  //         0,
  //     );
  // }, [leftPinnedColumns, columnWidths]);

  // const rightPinnedWidth = useMemo(() => {
  //     return rightPinnedColumns.reduce(
  //         (sum, column) => sum + columnWidths[column.id],
  //         0,
  //     );
  // }, [rightPinnedColumns, columnWidths]);

  const pinnedLeftStyle = useMemo(() => {
    return {
      position: "sticky" as const,
      left: 0,
      zIndex: 2,
      boxShadow:
        leftPinnedColumns.length > 0 ? "2px 0 4px rgba(0,0,0,0.1)" : "none",
      backgroundColor: theme.palette.background.paper,
    };
  }, [leftPinnedColumns, theme.palette.background.paper]);

  const pinnedRightStyle = useMemo(() => {
    return {
      position: "sticky" as const,
      right: 0,
      zIndex: 2,
      boxShadow:
        rightPinnedColumns.length > 0 ? "-2px 0 4px rgba(0,0,0,0.1)" : "none",
      backgroundColor: theme.palette.background.paper,
    };
  }, [rightPinnedColumns, theme.palette.background.paper]);

  const value: TableColumnContextType<TRowData> = useMemo(
    () => ({
      // Provided props with defaults
      columnWidths,
      allColumns: columns,
      visibleColumns: columns.filter(
        column => !hiddenColumns.includes(column.id)
      ),
      hiddenColumns,
      pinnedColumns,
      pinnedLeftStyle,
      pinnedRightStyle,

      // Handlers
      setColumnWidths,
      resizeColumn,
      setColumnWidth,
      pinColumn,
      hideColumn,
      showColumn,
      autosizeColumn,
    }),
    [
      columnWidths,
      columns,
      hiddenColumns,
      pinnedColumns,
      pinnedLeftStyle,
      pinnedRightStyle,
      resizeColumn,
      setColumnWidth,
      pinColumn,
      hideColumn,
      showColumn,
      autosizeColumn,
    ]
  );

  return (
    <TableColumnContext.Provider value={value}>
      {children}
    </TableColumnContext.Provider>
  );
};

export const useTableColumnContext = <TRowData = any,>(): TableColumnContextType<TRowData> => {
  const context = useContext(TableColumnContext);
  if (!context) {
    throw new Error(
      "useTableColumnContext must be used within a TableProvider"
    );
  }
  return context as TableColumnContextType<TRowData>;
};

export default TableColumnContext;
