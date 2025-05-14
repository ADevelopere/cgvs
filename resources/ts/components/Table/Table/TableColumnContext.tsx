import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import { EditableColumn, PinPosition } from "@/types/table.type";
import { useTableContext } from "./TableContext";
import { useTheme } from "@mui/material";

export type TableColumnContextType = {
    // Table data and configuration
    allColumns: EditableColumn[];
    columnWidths: Record<string, number>;
    visibleColumns: EditableColumn[];
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

const TableColumnContext = createContext<TableColumnContextType | null>(null);

export type TableColumnsProviderProps = {
    children: ReactNode;
    initialWidths: Record<string, number>;
    onResizeColumn?: (columnId: string, newWidth: number) => void;
    onPinColumn?: (columnId: string, position: PinPosition) => void;
    onHideColumn?: (columnId: string) => void;
    onShowColumn?: (columnId: string) => void;
    onAutosizeColumn?: (columnId: string) => void;
};

export const TableColumnsProvider = ({
    children,
    initialWidths,
    onResizeColumn,
    onPinColumn,
    onHideColumn,
    onShowColumn,
    onAutosizeColumn,
}: TableColumnsProviderProps) => {
    const theme = useTheme();
    const { data, columns } = useTableContext();

    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
        () => initialWidths,
    );

    useEffect(() => {
        // Add missing columns from initialWidths if not present
        setColumnWidths((prev) => {
            // Only add keys that are missing
            const updated = { ...prev };
            let changed = false;
            for (const col of columns) {
                if (
                    !(col.id in updated) &&
                    initialWidths[col.id] !== undefined
                ) {
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
            const column = columns.find((col) => col.id === columnId);
            if (column?.widthStorageKey) {
                localStorage.setItem(column.widthStorageKey, String(newWidth));
            }
            setColumnWidths((prevWidths) => ({
                ...prevWidths,
                [columnId]: Math.max(newWidth, 50), // Ensure minimum width of 50px
            }));
        },
        [columns, initialWidths],
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
        [setColumnWidths, onResizeColumn],
    );

    const pinColumn = useCallback((columnId: string, position: PinPosition) => {
        setPinnedColumns((prev) => ({
            ...prev,
            [columnId]: position,
        }));
        onPinColumn?.(columnId, position);
    }, []);

    const hideColumn = useCallback((columnId: string) => {
        setHiddenColumns((prev) => [...prev, columnId]);
        onHideColumn?.(columnId);
    }, []);

    const showColumn = useCallback((columnId: string) => {
        setHiddenColumns((prev) => prev.filter((id) => id !== columnId));
        onShowColumn?.(columnId);
    }, []);

    // Auto-size column method
    const autosizeColumn = useCallback(
        (columnId: string) => {
            const column = columns.find((col: EditableColumn) => col.id === columnId);
            if (!column) return;

            // Use requestAnimationFrame to ensure DOM is ready
            requestAnimationFrame(() => {
                // Create a temporary span element to measure text width
                const tempSpan = document.createElement("span");
                tempSpan.style.visibility = "hidden";
                tempSpan.style.position = "absolute";
                tempSpan.style.whiteSpace = "nowrap";
                tempSpan.style.font = window.getComputedStyle(
                    document.body,
                ).font;
                document.body.appendChild(tempSpan);

                // Start with the column label width + padding for icons
                tempSpan.textContent = column.label;
                let maxWidth = tempSpan.offsetWidth + 80; // Add space for icons and padding

                // Check data cells
                data.forEach((row: any) => {
                    let cellValue =
                        typeof column.accessor === "function"
                            ? column.accessor(row)
                            : row[column.accessor];

                    if (cellValue != null && cellValue !== undefined) {
                        // Format the cell value based on column type
                        let formattedValue = String(cellValue);
                        if (
                            column.type === "date" &&
                            typeof cellValue === "string"
                        ) {
                            try {
                                const date = new Date(cellValue);
                                formattedValue = !isNaN(date.getTime())
                                    ? date.toLocaleDateString()
                                    : cellValue;
                            } catch (e) {
                                formattedValue = cellValue;
                            }
                        }

                        tempSpan.textContent = formattedValue;
                        const cellWidth = tempSpan.offsetWidth + 16; // Add padding
                        maxWidth = Math.max(maxWidth, cellWidth);
                    }
                });

                // Clean up and update
                document.body.removeChild(tempSpan);
                setColumnWidths((prev) => ({
                    ...prev,
                    [columnId]: maxWidth + 20, // Add a little extra space
                }));
            });
            onAutosizeColumn?.(columnId);
        },
        [columns, data],
    );

    // Filter out hidden columns
    const visibleColumns = useMemo(() => {
        return columns.filter((column) => !hiddenColumns.includes(column.id));
    }, [columns, hiddenColumns]);

    // Group columns by pin position
    const leftPinnedColumns = useMemo(() => {
        return visibleColumns.filter(
            (column) => pinnedColumns[column.id] === "left",
        );
    }, [visibleColumns, pinnedColumns]);

    const rightPinnedColumns = useMemo(() => {
        return visibleColumns.filter(
            (column) => pinnedColumns[column.id] === "right",
        );
    }, [visibleColumns, pinnedColumns]);

    const unpinnedColumns = useMemo(() => {
        return;
        visibleColumns.filter((column) => !pinnedColumns[column.id]);
    }, [visibleColumns, pinnedColumns]);

    const leftPinnedWidth = useMemo(() => {
        return leftPinnedColumns.reduce(
            (sum, column) => sum + columnWidths[column.id],
            0,
        );
    }, [leftPinnedColumns, columnWidths]);

    const rightPinnedWidth = useMemo(() => {
        return rightPinnedColumns.reduce(
            (sum, column) => sum + columnWidths[column.id],
            0,
        );
    }, [rightPinnedColumns, columnWidths]);

    const pinnedLeftStyle = useMemo(() => {
        return {
            position: "sticky" as const,
            left: 0,
            zIndex: 2,
            boxShadow:
                leftPinnedColumns.length > 0
                    ? "2px 0 4px rgba(0,0,0,0.1)"
                    : "none",
            backgroundColor: theme.palette.background.paper,
        };
    }, [leftPinnedColumns, theme.palette.background.paper]);

    const pinnedRightStyle = useMemo(() => {
        return {
            position: "sticky" as const,
            right: 0,
            zIndex: 2,
            boxShadow:
                rightPinnedColumns.length > 0
                    ? "-2px 0 4px rgba(0,0,0,0.1)"
                    : "none",
            backgroundColor: theme.palette.background.paper,
        };
    }, [rightPinnedColumns, theme.palette.background.paper]);

    const value: TableColumnContextType = useMemo(
        () => ({
            // Provided props with defaults
            columnWidths,
            allColumns: columns,
            visibleColumns: columns.filter(
                (column) => !hiddenColumns.includes(column.id),
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
            columns,
            columnWidths,
            hiddenColumns,
            pinnedColumns,
            setColumnWidths,
            resizeColumn,
            setColumnWidth,
            pinColumn,
            hideColumn,
            showColumn,
            autosizeColumn,
        ],
    );

    return (
        <TableColumnContext.Provider value={value}>
            {children}
        </TableColumnContext.Provider>
    );
};

export const useTableColumnContext = () => {
    const context = useContext(TableColumnContext);
    if (!context) {
        throw new Error(
            "useTableColumnContext must be used within a TableProvider",
        );
    }
    return context;
};

export default TableColumnContext;
