"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { AnyColumn, PinPosition } from "../types";
import { useTableContext } from "./TableContext";
import { useTheme } from "@mui/material";
import { TABLE_CHECKBOX_CONTAINER_SIZE } from "../constants";

export type TableColumnContextType<
  TRowData,
  TRowId extends string | number = string | number,
> = {
  // Table data and configuration
  allColumns: readonly AnyColumn<TRowData, TRowId>[];
  columnWidths: Record<string, number>;
  visibleColumns: readonly AnyColumn<TRowData, TRowId>[];
  hiddenColumns: readonly string[];
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
  // Calculated widths
  indexColWidth: number;
  totalWidth: number;
  colSpan: number;
};

const TableColumnContext =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createContext<TableColumnContextType<any, any> | null>(null);

export type TableColumnsProviderProps = {
  children: ReactNode;
  initialWidths: Record<string, number>;
  containerRef?: React.RefObject<HTMLDivElement>;
  rowSelectionEnabled?: boolean;
  onResizeColumnAction?: (columnId: string, newWidth: number) => void;
  onPinColumnAction?: (columnId: string, position: PinPosition) => void;
  onHideColumnAction?: (columnId: string) => void;
  onShowColumnAction?: (columnId: string) => void;
  onAutosizeColumnAction?: (columnId: string) => void;
};

export const TableColumnsProvider = <
  TRowData,
  TRowId extends string | number = string | number,
>({
  children,
  initialWidths,
  containerRef,
  rowSelectionEnabled = false,
  onResizeColumnAction,
  onPinColumnAction,
  onHideColumnAction,
  onShowColumnAction,
  onAutosizeColumnAction,
}: TableColumnsProviderProps) => {
  const theme = useTheme();
  const { columns, data, pageInfo } = useTableContext<TRowData, TRowId>();

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    () => initialWidths
  );
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const previousContainerWidthRef = useRef<number>(0);

  // Calculate the index column width dynamically based on the maximum index value
  const maxIndexValue = useMemo(() => {
    return pageInfo ? pageInfo.total : data.length;
  }, [pageInfo, data.length]);

  const indexColWidth = useMemo(() => {
    const maxDigits = maxIndexValue?.toString().length || 1;
    return Math.max(50, maxDigits * 15 + 20); // Minimum width of 50px, 15px per digit, and 20px padding
  }, [maxIndexValue]);

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

  // Auto-calculate column widths if not provided
  useEffect(() => {
    if (!containerRef?.current || Object.keys(columnWidths).length > 0) return;
    
    const containerWidthValue = containerRef.current.offsetWidth;
    if (containerWidthValue === 0) return; // Wait for proper measurement
    
    const fixedWidth = indexColWidth + (rowSelectionEnabled ? TABLE_CHECKBOX_CONTAINER_SIZE : 0);
    const availableWidth = containerWidthValue - fixedWidth - 20; // minus scrollbar
    
    const newWidths: Record<string, number> = {};
    
    // First, handle non-resizable columns and load from localStorage
    let totalFixedWidth = 0;
    columns.forEach(column => {
      // Try localStorage first
      if (column.widthStorageKey) {
        const saved = localStorage.getItem(column.widthStorageKey);
        if (saved) {
          newWidths[column.id] = Math.max(parseInt(saved, 10), 50);
          return;
        }
      }
      
      // Non-resizable columns use their initialWidth
      if (column.resizable === false) {
        const width = column.initialWidth || 100;
        newWidths[column.id] = width;
        totalFixedWidth += width;
      }
    });
    
    // Distribute remaining width among resizable columns
    const resizableColumns = columns.filter(
      col => col.resizable !== false && !newWidths[col.id]
    );
    
    if (resizableColumns.length > 0) {
      const remainingWidth = Math.max(availableWidth - totalFixedWidth, 0);
      const widthPerColumn = Math.floor(remainingWidth / resizableColumns.length);
      
      resizableColumns.forEach(column => {
        newWidths[column.id] = Math.max(widthPerColumn, 50);
      });
    }
    
    setColumnWidths(newWidths);
  }, [containerRef, columns, indexColWidth, rowSelectionEnabled, columnWidths]);

  // Effect to attach ResizeObserver to detect container width changes
  useEffect(() => {
    if (!containerRef?.current) return;

    const updateContainerWidth = () => {
      const element = containerRef.current;
      if (element) {
        const rect = element.getBoundingClientRect();
        const newWidth = rect.width;
        if (newWidth !== previousContainerWidthRef.current && newWidth > 0) {
          setContainerWidth(newWidth);
        }
      }
    };

    // Initial measurement
    updateContainerWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateContainerWidth();
    });

    const element = containerRef.current;
    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);

  // Filter out hidden columns for scaling calculations
  const visibleColumnsForScaling = useMemo(() => {
    return columns.filter(column => !hiddenColumns.includes(column.id));
  }, [columns, hiddenColumns]);

  // Effect to handle container width changes and proportional column scaling
  useEffect(() => {
    if (!containerWidth || containerWidth === previousContainerWidthRef.current) {
      return;
    }

    const previousWidth = previousContainerWidthRef.current;
    if (previousWidth === 0) {
      // First render, just store the width
      previousContainerWidthRef.current = containerWidth;
      return;
    }

    // Calculate fixed widths (index column + checkbox column if enabled)
    const fixedWidth =
      indexColWidth + (rowSelectionEnabled ? TABLE_CHECKBOX_CONTAINER_SIZE : 0);

    // Calculate current total column widths (excluding fixed columns)
    const currentColumnsWidth = visibleColumnsForScaling.reduce(
      (sum, column) => sum + (columnWidths[column.id] || 0),
      0
    );

    // Calculate available space for columns in previous and current width
    const previousAvailableWidth = previousWidth - fixedWidth;
    const currentAvailableWidth = containerWidth - fixedWidth;

    // Only scale if we have valid widths
    if (
      currentColumnsWidth > 0 &&
      previousAvailableWidth > 0 &&
      currentAvailableWidth > 0
    ) {
      const scale = currentAvailableWidth / previousAvailableWidth;

      // Scale all column widths proportionally
      const newColumnWidths: Record<string, number> = {};
      visibleColumnsForScaling.forEach(column => {
        const currentWidth = columnWidths[column.id] || 0;
        const scaledWidth = Math.max(50, Math.round(currentWidth * scale)); // Minimum 50px
        newColumnWidths[column.id] = scaledWidth;
      });

      // Update column widths
      setColumnWidths(prevWidths => ({ ...prevWidths, ...newColumnWidths }));
    }

    previousContainerWidthRef.current = containerWidth;
  }, [
    containerWidth,
    visibleColumnsForScaling,
    columnWidths,
    indexColWidth,
    rowSelectionEnabled,
  ]);

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

  const [pinnedColumns, setPinnedColumns] = useState<
    Record<string, PinPosition>
  >({} as Record<string, PinPosition>);

  // Column management methods
  const resizeColumn = useCallback(
    (columnId: string, newWidth: number) => {
      setColumnWidth(columnId, newWidth);
      onResizeColumnAction?.(columnId, newWidth);
    },
    [setColumnWidth, onResizeColumnAction]
  );

  const pinColumn = useCallback(
    (columnId: string, position: PinPosition) => {
      setPinnedColumns(prev => ({
        ...prev,
        [columnId]: position,
      }));
      onPinColumnAction?.(columnId, position);
    },
    [onPinColumnAction]
  );

  const hideColumn = useCallback(
    (columnId: string) => {
      setHiddenColumns(prev => [...prev, columnId]);
      onHideColumnAction?.(columnId);
    },
    [onHideColumnAction]
  );

  const showColumn = useCallback(
    (columnId: string) => {
      setHiddenColumns(prev => prev.filter(id => id !== columnId));
      onShowColumnAction?.(columnId);
    },
    [onShowColumnAction]
  );

  // Auto-size column method (simplified for generic architecture)
  const autosizeColumn = useCallback(
    (columnId: string) => {
      const column = columns.find(col => col.id === columnId);
      if (!column) return;

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        // Try to find actual DOM elements to measure
        const headerCell = document.querySelector(
          `th[data-column-id="${columnId}"]`
        );
        const cells = document.querySelectorAll(
          `td[data-column-id="${columnId}"]`
        );

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
      onAutosizeColumnAction?.(columnId);
    },
    [columns, onAutosizeColumnAction]
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

  // Calculate total width of the table
  const totalWidth = useMemo(() => {
    const columnsWidth = visibleColumnsForScaling.reduce(
      (sum, column) => sum + (columnWidths[column.id] || 0),
      0
    );
    return (
      columnsWidth +
      indexColWidth +
      (rowSelectionEnabled ? TABLE_CHECKBOX_CONTAINER_SIZE : 0)
    );
  }, [visibleColumnsForScaling, columnWidths, rowSelectionEnabled, indexColWidth]);

  // Calculate column span for empty rows
  const colSpan = useMemo(() => {
    return visibleColumnsForScaling.length + 1 + (rowSelectionEnabled ? 1 : 0);
  }, [visibleColumnsForScaling, rowSelectionEnabled]);

  const value: TableColumnContextType<TRowData, TRowId> = useMemo(
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

      // Calculated values
      indexColWidth,
      totalWidth,
      colSpan,

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
      indexColWidth,
      totalWidth,
      colSpan,
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

export const useTableColumnContext = <
  TRowData,
  TRowId extends string | number = string | number,
>(): TableColumnContextType<TRowData, TRowId> => {
  const context = useContext(
    TableColumnContext as React.Context<
      TableColumnContextType<TRowData, TRowId>
    >
  );
  if (!context) {
    throw new Error(
      "useTableColumnContext must be used within a TableProvider"
    );
  }
  return context;
};

export default TableColumnContext;
